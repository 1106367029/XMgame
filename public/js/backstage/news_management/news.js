new Vue({
    el:"#content",
    data:{
        uptitle:"",upcontent:"",upsource:"",uplink:"",newid:"",keyword:"",uptype:"",
        imgBase64:[],//上传新闻时候的图片数组
        imgs:[],//显示详细新闻信息时候的图

    },
    methods:{
        insertnew(){//上传新闻
            var Pic = this.imgBase64;
            var imgurls=new Array();
            var time=new Date().toLocaleTimeString().replace(/:/ig,"-");
            var optionval=$("#searchtype>option:selected").val();
            for (var key in Pic) {
                Pic[key] = Pic[key].toString().replace(/^data:image\/(png|jpg);base64,/, "");
                var imgname="new"+time+key;
                var dir=`public/img/new`;//判断这个用户的目录是否存在
                $.ajax({
                    type: 'POST',
                    url: 'http://127.0.0.1:3000/user/upimg',
                    data: {img:Pic[key],imgname,dir},
                    dataType: 'json',
                    async:false,
                    success: function (res) {
                        if (res.code==200){
                            imgurls[imgurls.length]=res.imgurl;
                        }
                        else {
                            console.log(res);
                            alert("上传图片失败")
                        }

                    }
                });
            }
            imgurls=imgurls.join(',');
            axios.post("http://127.0.0.1:3000/controller/insertnew",`type=${optionval}&title=${this.uptitle}&content=${this.upcontent}&source=${this.upsource}&link=${this.uplink}&img=${imgurls.replace(/public\//ig,"")}`).then(function (res) {
                if (res.data.code==200){
                    alert(res.data.msg);
                    location.reload(true);
                }
                else{
                    alert(res.data.msg)
                }
            })
        },
        clean(){//清楚发布新闻的输入框
            this.uptitle="";
            this.upcontent="";
            this.upsource="";
            this.uplink=""
        },
        searchbyid(){
            $("#page").css("display","none");
            $("#tbody").children().remove();
            axios.post("http://127.0.0.1:3000/gameinfo/selnewbyid",`ginfo_id=${this.newid}`).then(function (res) {
                if (res.data.code==200){
                    var result=res.data.result[0];
                    var time=new Date(result.time).toLocaleString();
                    $("#tbody").prepend(`<tr><td>${result.ginfo_id}</td><td>${result.title}</td>\
                                            <td>${result.content}</td><td>${result.img}</td>\
                                            <td>${time}</td><td>${result.source}</td>\
                                            <td><button type="button" onclick="seedetail(${result.ginfo_id})">查看详情</button></td>\
                                            <td><a href="javascript:" class="active" onclick="deletenew(${result.ginfo_id},this)">\
                                            <i class="icon-remove icon-large text-danger text-active"></i>\
                                            </a></td></tr>`);
                }
                else{
                    console.log("没有这条新闻")
                }
            })
        },
        searchbykey(){
            $("#page").css("display","none");
            $("#tbody").children().remove();
            axios.post("http://127.0.0.1:3000/controller/selnewbykey",`keyword=${this.keyword}`).then(function (res) {
                if (res.data.code==200){
                    var results=res.data.result.slice(0,8);
                    for (var i=0;i<results.length;i++) {
                        var result = results[i];
                        var time = new Date(result.time).toLocaleString();
                        $("#tbody").append(`<tr><td>${result.ginfo_id}</td><td>${result.title}</td>\
                                                <td>${result.content}</td><td>${result.img}</td>\
                                                <td>${time}</td><td>${result.source}</td>\
                                                <td><button type="button" onclick="seedetail(${result.ginfo_id})">查看详情</button></td>\
                                                <td><a href="javascript:" class="active" onclick="deletenew(${result.ginfo_id},this)">\
                                                <i class="icon-remove icon-large text-danger text-active"></i>\
                                                </a></td></tr>`);
                    }
                }
                else{
                    alert(res.data.msg)
                }
            })

        },
        deletenew(ginfo_id,tr){
            if(confirm(`是否真的删除" ${ginfo_id} "这条新闻`)){//提示是否真的删除
                axios.post("http://127.0.0.1:3000/controller/delnew",`ginfo_id=${ginfo_id}`).then((res)=>{
                    if (res.data.code==200){//判断是否登录了
                        alert(res.data.msg);
                        $(tr).parent().parent().remove();//移除已经删除的用户

                    }else {
                        alert(res.data.msg)
                    }
                });
            }

        },
        seedetail(ginfo_id){//查看新闻的详细信息
            axios.post("http://127.0.0.1:3000/gameinfo/selnewbyid",`ginfo_id=${ginfo_id}`).then(function (res) {
                if (res.data.code == 200) {
                    var result=res.data.result[0];
                   $("#detailtitle").val(result.title);
                   $("#detailcontent").val(result.content);
                   $("#newid").val(result.ginfo_id);
                   console.log();
                   if (result.img==null||result.img==""){
                   }
                   else {
                       var imgs=result.img.split(',');
                       for (var i=0;i<imgs.length;i++){
                           $("#img").append(`<div class="item">\
                                        <span class="cancel-btn">x</span>\
                                        <img src="${imgs[i]}"></div>`)
                       }
                   }

                } else {
                    console.log("没有这条新闻")
                }
            })
        },
        showall(){
            $("#tbody").children().remove();
            $("#page").css("display","block");
            axios.get("http://127.0.0.1:3000/gameinfo/news").then(function (res) {
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
                    var results=res.data.result.slice((page-1)*8,8*page);
                    for (var i=0;i<results.length;i++) {
                        var result = results[i];
                        var time = new Date(result.time).toLocaleString();
                        $("#tbody").append(`<tr><td>${result.ginfo_id}</td><td>${result.title}</td>\
                                                <td>${result.content}</td><td>${result.img}</td>\
                                                <td>${time}</td><td>${result.source}</td>\
                                                <td><button type="button" onclick="seedetail(${result.ginfo_id})">查看详情</button></td>\
                                                <td><a href="javascript:" class="active" onclick="deletenew(${result.ginfo_id},this)">\
                                                <i class="icon-remove icon-large text-danger text-active"></i>\
                                                </a></td></tr>`);
                    }
                }
                else{
                    alert(res.data.msg)
                }
            })
        },
        updatenew(){//修改新闻
            var newid=$("#newid").val();
            var title=$("#detailtitle").val();
            var content= $("#detailcontent").val();
            axios.post("http://127.0.0.1:3000/controller/updatenew",`ginfo_id=${newid}&title=${title}&content=${content}`).then(function (res) {
                if (res.data.code==200){
                   alert("修改成功");
                   $("#newid").val("");
                   $("#detailtitle").val("");
                   $("#detailcontent").val("");
                }
                else{
                    alert("修改失败")
                }
            })

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
            /**得到FileList的第一个元素，也就是上传的图片**/
            if (this.imgBase64.length<4){//这里只能上传三种图片
                var _this = this;
                var event = event || window.event;
                var file = event.target.files[0];
                /**创建一个FileReader实例，用来读取文件**/
                var reader = new FileReader();
                //转base64
                /**成功读取之后将图片显示出来**/
                reader.onload = function(e) {
                    _this.imgBase64.push(e.target.result);
                }
                if(file.size/1024/1025/5>5){
                    alert("不能上传超过5MB的图片");
                }
                else{
                    reader.readAsDataURL(file);
                }
            }else {
                alert("只能上传四张图片")
            }
        },
        //删除图片
        delImg(index){
            this.imgBase64.splice(index,1);
        },


    },
    created(){
        window.deletenew=this.deletenew;
        window.seedetail=this.seedetail;
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