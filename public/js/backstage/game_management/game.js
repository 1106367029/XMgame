new Vue({
    el:"#content",
    data:{
        game_name:"",rec_reason:"",
        gameType: [{value: '端游'}, {value: '手游'}, {value: '现实'}, {value: '亲子'}],
        selected: '',
        gamelist:"",
        game_id:"",//搜索时的游戏id
        allpage:1,//记录帖子当前的页面是第几页，默认为1
        imgBase64:"",//上传时候的图片数组


    },
    methods:{
        gameId (index) {//自动生成game的id
            var gametype=index+1;//游戏的类型
            //将游戏类型传给后台，检索数据库获得最后一个此类型游戏的id然后+1
            axios.post("http://127.0.0.1:3000/controller/selgamebytype",`type=${gametype}`).then(function (res) {
                if (res.data.code==200){
                   var game_id=res.data.result[0].game_id+1;
                    $("#game_id").val(game_id);
                }
                else{
                    alert(res.data.msg)
                }
            })
            //console.log(this.gameType[index].value)
        },
        insertgame(){
            var type=Number($("#game_type>option:selected").val())+1;//上传的游戏类型
            var game_id=$("#game_id").val();//游戏名字
            var Pic = this.imgBase64;
            var imgurls="";
            Pic= Pic.toString().replace(/^data:image\/(png|jpg);base64,/, "");
            var imgname="logo";
            var dir=`public/img/game/${type}/${game_id}`;//判断这个用户的目录是否存在
            $.ajax({
                type: 'POST',
                url: 'http://127.0.0.1:3000/user/upimg',
                data: {img:Pic,imgname,dir},
                dataType: 'json',
                async:false,
                success: function (res) {
                    if (res.code==200){
                        imgurls=res.imgurl;
                        axios.post("http://127.0.0.1:3000/controller/insertgame",`game_id=${game_id}&game_name=${this.game_name}&rec_reason=${this.rec_reason}&type=${type}&picture=${imgurls.replace(/public\//ig,"")}`).then(function (res) {
                            if (res.data.code==200){
                                alert(res.data.msg);
                                location.reload(true);
                            }
                            else{
                                alert(res.data.msg)
                            }
                        })
                    }
                    else {
                        //console.log(res);
                        alert("上传失败，请重新上传")
                    }

                }
            });
            console.log(imgurls);


        },
        showall(){
            $("#tbody").children().remove();
            $("#page").css("display","block");
            axios.get("http://127.0.0.1:3000/gameinfo/info").then(function (res) {
                if (res.data.code==200){
                    var allpage=res.data.result.length/8;//分的页数
                    if (allpage==parseInt(allpage)){//整除
                        allpage=parseInt(allpage);
                    }
                    else{//没整除
                        allpage=parseInt(allpage)+1;
                    }
                    this.allpage=allpage;
                    //分页
                    $("#next").prev().prev().children("a").html(allpage);//改变页面的总页
                    var a=$("#page").find(".active").children("a");//获得页数a标签
                    var page=Number($(a).html());
                    var list=res.data.result.slice((page-1)*8,8*page);
                    for (var i=0;i<list.length;i++){
                        if (list[i].hot==1){
                            $("#tbody").prepend(`<tr><td>${list[i].game_id}</td>\
                                        <td>${list[i].game_name}</td>\
                                        <td>${list[i].type}</td>\
                                        <td>${list[i].picture}</td>\
                                        <td>${list[i].rec_reason}</td>\
                                        <td><button class="btn btn-small btn-danger" onclick="hot(${list[i].game_id},1,this)">取消热门</button></td>\
                                        <td><a href="javascript:" class="active" onclick="deletegame(${list[i].game_id},this)">\
                                            <i class="icon-remove icon-large text-danger text-active"></i>\
                                            </a></td></tr>`)
                        }
                        else {
                            $("#tbody").prepend(`<tr><td>${list[i].game_id}</td>\
                                        <td>${list[i].game_name}</td>\
                                        <td>${list[i].type}</td>\
                                        <td>${list[i].picture}</td>\
                                        <td>${list[i].rec_reason}</td>\
                                        <td><button class="btn btn-small btn-success" onclick="hot(${list[i].game_id},0,this)">设为热门</button></td>\
                                        <td><a href="javascript:" class="active" onclick="deletegame(${list[i].game_id},this)">\
                                            <i class="icon-remove icon-large text-danger text-active"></i>\
                                            </a></td></tr>`)
                        }

                    }
                }
                else{
                    alert(res.data.msg)
                }
            })
        },
        searchbyid(){
            $("#tbody").children().remove();
            axios.post("http://127.0.0.1:3000/controller/selgamebyid",`game_id=${this.game_id}`).then(function (res) {
                if (res.data.code==200){
                    var list=res.data.result[0];
                    $("#tbody").prepend(`<tr><td>${list.game_id}</td>\
                                        <td>${list.game_name}</td>\
                                        <td>${list.type}</td>\
                                        <td>${list.picture}</td>\
                                        <td>${list.rec_reason}</td>\
                                        <td><a href="javascript:" class="active" onclick="deletegame(${list.game_id},this)">\
                                            <i class="icon-remove icon-large text-danger text-active"></i>\
                                            </a></td></tr>`)
                    $("#page").css("display","none")
                }
                else{
                    $("#page").css("display","none")
                    alert(res.data.msg)
                }
            })
        },
        deletegame(gameid,tr){//删除用户
            if(confirm(`是否真的删除" ${gameid} "这个游戏，跟其有关的游戏攻略都将删除！请慎重！！！！`)){
                axios.post("http://127.0.0.1:3000/controller/delgame",`gameid=${gameid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        $(tr).parent().parent().remove();//移除已经删除的游戏

                    }else {
                        alert(res.data.msg)
                    }
                });
            }

        },
        nextpage(){//下一页
            var a=$("#page").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            var allpage=Number($("#next").prev().prev().children("a").html());
            if (page>=allpage){
                alert("这已经是最后一页")
            }else {
                $(a).html(page+1);
                this.showall();
            }
        },
        prevpage(){
            var a=$("#page").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $(a).html(page-1);
                this.showall();
            }
        },
        firstpage(){//分页点击首页按钮
            var a=$("#page").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.showall();
        },
        lastpage(){
            var a=$("#page").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#page").find(".active").children("a").html(page);
            this.showall();
        },
        getImgBase(){
           if ($("#game_type>option:selected").val()==undefined){
               alert("先选择游戏类型")
           }
           else {
               /**得到FileList的第一个元素，也就是上传的图片**/
               var _this = this;
               var event = event || window.event;
               var file = event.target.files[0];
               /**创建一个FileReader实例，用来读取文件**/
               var reader = new FileReader();
               //转base64
               /**成功读取之后将图片显示出来**/
               reader.onload = function(e) {
                   _this.imgBase64=e.target.result;
               }
               if(file.size/1024/1025/5>5){
                   alert("不能上传超过5MB的图片");
               }
               else{
                   reader.readAsDataURL(file);
               }
           }
        },
        hot(game_id,hot,tr){//游戏的热门管理
            if(hot==1){//取消热门
                axios.post("http://127.0.0.1:3000/controller/updategame",`hot='0'&game_id=${game_id}`).then(function (res) {
                    if (res.data.code==200){
                        alert(`游戏${game_id}取消热门成功`);
                        $(tr).removeClass('btn-danger').addClass('btn-success').html("设为热门")
                    }
                    else{
                        alert("设置失败")
                    }
                })
            }else {//设为热门
                axios.post("http://127.0.0.1:3000/controller/updategame",`hot=1&game_id=${game_id}`).then(function (res) {
                    if (res.data.code==200){
                        alert(`游戏${game_id}设为热门成功`);
                        $(tr).removeClass('btn-success').addClass('btn-danger').html("取消热门")
                    }
                    else{
                        alert("设置失败")
                    }
                })
            }
        }

    },
    created(){
        window.deletegame=this.deletegame;
        window.hot=this.hot;
        $.when( $.ajax(
            {
                async: false,//同步
                url : "http://127.0.0.1:3000/controller/cisLogin",//判断是否登录
                dataType: "JSON",
                type: "GET",
                success: function (data) {
                }
            })
        ).done((islogin)=>{
            if (islogin.code==200){
                var cid=islogin.cinfo.cid;
                $("#cid").html(cid);
            }else {
                alert("请登录");
                location.replace("bs_login.html")
            }
        });
    }
})