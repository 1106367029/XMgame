new Vue({
    el:"#content",
    data:{
        stepnum:2,//步骤的计数
        stratitle:"",//添加攻略时的攻略标题
        gameid:"",//添加攻略时的游戏id
        strlist:"",//搜索出的攻略list
        searchword:"",//搜索框的值
        allpage:1,//记录帖子当前的页面是第几页，默认为1
        imgBase64:[],//上传时候的图片数组
    },
    methods:{
        addstep(){//添加步骤
            if (this.stepnum==2){//第一次添加
                $("#Step1").after(`<article class="comment-item media arrow arrow-left" id="Step${this.stepnum}">\
                            <a class="pull-left thumb-small avatar"></a>\
                            <section class="media-body panel">\
                            <header class="panel-heading clearfix">步骤${this.stepnum}</header>\
                            <div class="col-lg-12 m-t-small">\
                            <textarea placeholder="输入攻略内容" rows="5" class="form-control"></textarea>\
                            </div><div class="col-lg-12 m-t-small">\
                            <a href="javascript:" class="btn btn-white btn-small btn-info" onclick="addstep()">\
                            <i class="icon-plus text-white"></i>添加步骤</a></div></section></article>`);
                this.stepnum++;
            }
            else if (this.stepnum==3){
                $("#Step2").after(`<article class="comment-item media arrow arrow-left" id="Step${this.stepnum}">\
                            <a class="pull-left thumb-small avatar"></a>\
                            <section class="media-body panel">\
                            <header class="panel-heading clearfix">步骤${this.stepnum}</header>\
                            <div class="col-lg-12 m-t-small">\
                            <textarea placeholder="输入攻略内容" rows="5" class="form-control"></textarea>\
                            </div><div class="col-lg-12 m-t-small">\
                            <a href="javascript:" class="btn btn-white btn-small btn-info" onclick="addstep()">\
                            <i class="icon-plus text-white"></i>添加步骤</a></div></section></article>`);
                this.stepnum++;
            }
            else if (this.stepnum==4){
                $("#Step3").after(`<article class="comment-item media arrow arrow-left" id="Step${this.stepnum}">\
                            <a class="pull-left thumb-small avatar"></a>\
                            <section class="media-body panel">\
                            <header class="panel-heading clearfix">步骤${this.stepnum}</header>\
                            <div class="col-lg-12 m-t-small">\
                            <textarea placeholder="输入攻略内容" rows="5" class="form-control"></textarea>\
                            </div><div class="col-lg-12 m-t-small">\
                            <a href="javascript:" class="btn btn-white btn-small btn-info" onclick="addstep()">\
                            <i class="icon-plus text-white"></i>添加步骤</a></div></section></article>`);
                this.stepnum++;
            }
            else if (this.stepnum==5){
                $("#Step4").after(`<article class="comment-item media arrow arrow-left" id="Step${this.stepnum}">\
                            <a class="pull-left thumb-small avatar"></a>\
                            <section class="media-body panel">\
                            <header class="panel-heading clearfix">步骤${this.stepnum}</header>\
                            <div class="col-lg-12 m-t-small">\
                            <textarea placeholder="输入攻略内容" rows="5" class="form-control"></textarea>\
                            </div></section></article>`);
                this.stepnum++;
            }
            else {
                alert("最多可以添加5个步骤")
            }

        },
        addstrategy(){//添加攻略
            var content1=$("#Step1").find("textarea").val();//步骤一的攻略内容
            var content2=$("#Step2").find("textarea").val();
            var content3=$("#Step3").find("textarea").val();
            var content4=$("#Step4").find("textarea").val();
            var content5=$("#Step5").find("textarea").val();
            var gameid=Number(this.gameid);
            var stratitle=this.stratitle;
            if(content1==""||gameid==""||stratitle==""){
                alert("攻略内容，攻略标题，游戏id不可以有一个为空")
            }else{
                $.when(
                    $.ajax(
                        {
                            async: false,//同步
                            url : "http://127.0.0.1:3000/controller/getgamebyid",//判断游戏的id是否存在游戏表里
                            data:{gameid},
                            dataType: "JSON",
                            type: "POST",
                            success: function (data) {
                            }
                        }),
                ).done((ishave)=>{
                    if (ishave.code==200){//当存在填入游戏的时候
                        var Pic = this.imgBase64;
                        var imgurls=new Array();
                        var time=new Date().toLocaleTimeString().replace(/:/ig,"-");
                        for (var key in Pic) {
                            Pic[key] = Pic[key].toString().replace(/^data:image\/(png|jpg);base64,/, "");
                            var imgname=gameid+"str"+time+key;
                            var dir=`public/img/game/${parseInt(gameid/100)}/${gameid}`;//判断这个用户的目录是否存在
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
                        axios.post("http://127.0.0.1:3000/controller/insertstra",`stra_title=${stratitle}&content1=${content1}&content2=${content2}&content3=${content3}&content4=${content4}&content5=${content5}&game_id=${gameid}&time=""&picture=${imgurls.replace(/public\//ig,"")}`).then((res)=>{
                            if (res.data.code==200){
                                alert(res.data.msg);
                               $("#Step1").find("textarea").val("");
                               $("#Step2").find("textarea").val("");
                               $("#Step3").find("textarea").val("");
                               $("#Step4").find("textarea").val("");
                               $("#Step5").find("textarea").val("");
                               this.gameid="";
                               this.stratitle="";
                               this.imgBase64=[];
                            }
                            else {
                                alert(res.data.msg)
                            }
                        })

                    }else{//游戏id不存在
                        alert(ishave.msg);
                    }
                })

            }
        },
        getImgBase(){
            /**得到FileList的第一个元素，也就是上传的图片**/
            if (this.imgBase64.length<5){
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
                alert("只能上传5张图片")
            }
        },
        //删除图片
        delImg(index){
            this.imgBase64.splice(index,1);
        },



        search(){//攻略搜索
            var optionval=$("#searchtype>option:selected").val();
            if (optionval==0){
                alert("请选择搜索的类型");
            }
            else if (optionval==1){//关键词搜索
                axios.post("http://127.0.0.1:3000/controller/selstrbykey",`keyword=${this.searchword}`).then((res)=>{
                    if (res.data.code==200){
                        var result=res.data.result;
                        for(var i=0;i<result.length;i++){
                            var time=result[i].time;
                            result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                        }
                        this.strlist=result;
                    }
                    else {
                        alert(res.data.msg);
                        this.strlist="";
                    }
                })

            }
            else if (optionval==2){//攻略id搜索
                axios.post("http://127.0.0.1:3000/gameinfo/selstrbyid",`stra_id=${this.searchword}`).then((res)=>{
                    if (res.data.code==200){
                        var result=res.data.result;
                        var time= result[0].time;
                        time=new Date(time).toLocaleString();
                        result[0].time=time;
                        this.strlist=result;
                    }
                    else {
                        alert(res.data.msg);
                        this.strlist="";
                    }
                })

            }
            else {//游戏id搜索
                axios.post("http://127.0.0.1:3000/controller/selstrbygameid",`game_id=${this.searchword}`).then((res)=>{
                    if (res.data.code==200){
                        var result=res.data.result;
                        for(var i=0;i<result.length;i++){
                            var time=result[i].time;
                            result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                        }
                        this.strlist=result;
                    }
                    else {
                        alert(res.data.msg);
                        this.strlist="";
                    }
                })
            }
        },
        showallstr(){//查询所有攻略的按钮
            $("#page").css("display","block");
            axios.post("http://127.0.0.1:3000/controller/selallstr").then((res)=>{
                if (res.data.code==200){
                    var allpage=res.data.result.length/8;//分的页数
                    this.allpage=allpage;
                    if (allpage==parseInt(allpage)){//整除
                        allpage=parseInt(allpage);
                    }
                    else{//没整除
                        allpage=parseInt(allpage)+1;
                    }
                    //分页
                    $("#next").prev().prev().children("a").html(allpage);//改变页面的总页
                    var a=$("#page").find(".active").children("a");//获得页数a标签
                    var page=Number($(a).html());
                    var result=res.data.result.slice((page-1)*8,8*page);
                    for(var i=0;i<result.length;i++){
                        var time=result[i].time;
                        result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                    }
                    this.strlist=result;
                }
                else {
                    alert(res.data.msg);
                    this.strlist="";
                }
            })

        },
        deletestr(a){//删除当前帖子
            var tr=$(a).parent().parent();
            var strid=$(tr).find("td:nth-child(1)").html();
            if (confirm(`确定要删除id为：“${strid}的这条用户帖吗？”`)){
                axios.post("http://127.0.0.1:3000/controller/delstra",`stra_id=${strid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        //页面上删除
                        $(tr).remove();
                    }
                    else {
                        alert(res.data.msg);
                    }
                })
            }
        },
        nextpage(){//下一页
            var a=$("#page").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page>=this.allpage){
                alert("这已经是最后一页")
            }else {
                $(a).html(page+1);
                this.showallstr();
            }
        },
        prevpage(){
            var a=$("#page").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $(a).html(page-1);
                this.showallstr();
            }
        },
        firstpage(){//分页点击首页按钮
            var a=$("#page").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.showallstr();
        },
        lastpage(){
            var a=$("#page").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#page").find(".active").children("a").html(page);
            this.showallstr();
        },

    },
    created(){
        window.addstep=this.addstep;
        window.deletestr=this.deletestr;
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