new Vue({
    el:".page",
    data:{
        content:"",//发表评论的内容
        list:"",//所有楼层显示的list
        listnum:"",//评论总数
        allpage:1,//记录当前的页面是第几页，默认为1
        allcontent:"",//书本集成内容
        txtcontent:"",//上传文件的内容
        statu:false,//表示没有登录
        booklist:"",//小说列表
    },
    methods:{
        insbook(){//发表活动的评论
            $.when(
                $.ajax(
                    {
                        async: false,//同步
                        url : "http://127.0.0.1:3000/user/isLogin",//判断是否登录
                        dataType: "JSON",
                        type: "GET",
                        success: function (data) {
                        }
                    }),
            ).done((islogin)=>{
                if (islogin.code==200){
                    var uid=islogin.userinfo.uid;//当前登录的用户的id
                    //插入评论
                    if (this.content!=""){
                        axios.post("http://127.0.0.1:3000/gameinfo/insbook",`content=${this.content}&uid=${uid}`).then((res)=>{
                            if (res.data.code==200){//搜索帖子的评论
                                alert(res.data.msg);
                                location.reload(true)
                            }
                            else {
                                alert(res.data.msg)
                            }
                        })
                    }else {
                        alert("发表内容不可为空")
                    }
                }else{
                    if (confirm("登录了才可发表评论")){
                        open("login.html","_self")
                    }
                }
            })


        },
        show(){
            axios.get("http://127.0.0.1:3000/gameinfo/book").then((res)=>{
                if (res.data.code==200){//搜索活动的所有楼层显示
                    this.listnum=res.data.result.length;
                    var allpage=res.data.result.length/8;//分的页数
                    this.allpage=allpage;
                    if (allpage==parseInt(allpage)){//整除
                        allpage=parseInt(allpage);
                    }
                    else{//没整除
                        allpage=parseInt(allpage)+1;
                    }
                    //分页
                    $("#page>ul").find(".next").prev().prev().children("a").html(allpage);//改变页面的总页
                    var a=$("#page>ul").find(".active").children("a");//获得页数a标签
                    var page=Number($(a).html());

                    var result=res.data.result.slice((page-1)*8,8*page);
                    for (var i=0;i<result.length;i++){
                        result[i].time=new Date(result[i].time).toLocaleString();
                    }
                    this.list=result;
                }
            })
        },
        nextpage(){//下一页
            var a=$("#page>ul").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page>=this.allpage){
                alert("这已经是最后一页")
            }
            else {
                $("#page").siblings("article").remove();
                $(a).html(page+1);
                this.show()
            }
        },
        prevpage(){
            var a=$("#page>ul").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $("#page").siblings("article").remove();
                $(a).html(page-1);
                this.show()
            }
        },
        firstpage(){//分页点击首页按钮
            $("#page").siblings("article").remove();
            var a=$("#page>ul").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.show()
        },
        lastpage(){
            $("#page").siblings("article").remove();
            var a=$("#page>ul").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#page>ul").find(".active").children("a").html(page);
            this.show()
        },
        card(){//书本弹窗
            $('#myModal').modal();
        },
        savefile(){//将小说保存到本地
            var content = $("#book").text();
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "file.txt");//saveAs(blob,filename)
        },
        bookforum(statu){
            if (statu==0){//评论转至千楼书论坛
                $(".comments").css("display","none");
                $("#bookforum").css("display","block");
            }else {
                $(".comments").css("display","block");
                $("#bookforum").css("display","none");
            }

        },
        upstory(){//上传小说至服务器
            if (this.statu==true){
                var objFile = document.getElementById("file");
                var files = $('#file').prop('files'); //获取到文件列表
                if(files.length == 0 || files.length > 1) {
                    alert('请选择一个文件');
                    return
                } else {
                    for(var i = 0; i<1; i++) {
                        var reader = new FileReader(); //新建一个FileReader
                        reader.readAsText(files[i], 'gb2312'); //读取文件
                        reader.onload = function(evt) {
                            var fileString = evt.target.result; // 读取文件内容
                            if(fileString==""){
                                alert("文件内容不可为空")
                            }
                            else {//将文件的内容上传至后台，登录才可上传
                                axios.post("http://127.0.0.1:3000/gameinfo/upbooktxt",`content=${fileString}`).then((res)=>{
                                    if (res.data.code==200){//搜索帖子的评论
                                        alert(res.data.msg);
                                        location.reload(true)
                                    }
                                    else {
                                        alert(res.data.msg);
                                    }
                                })
                            }

                        }
                    }
                }
            }else {
                if (confirm("登录后才可上传！")){
                    open("login.html","_self")
                }
            }

        },
        bookdetail(url){//查看书本详细内容
            axios.post("http://127.0.0.1:3000/gameinfo/txt",`url=${url}`).then((res)=>{
                if (res.data.code==200){//判断是否登录了
                    var result=res.data.result;//文件内容
                    $("#book").html(result);
                    $('#myModal').modal();
                }else {
                    alert("文件访问出错，刷新界面后再试")
                }
            });
        }
    },
    created(){
        axios.get("http://127.0.0.1:3000/user/isLogin").then((res)=>{
            if (res.data.code==200){//判断是否登录了
                this.statu=true;

            }else {
                this.statu=false;
            }
        });
        axios.get("http://127.0.0.1:3000/gameinfo/book").then((res)=>{
            if (res.data.code==200){
               var result=res.data.result;
               for (var i=0;i<result.length;i++){
                   this.allcontent=`${this.allcontent}<p>${result[i].content}。</p>`;
               }
                $("#book").html(this.allcontent);
            }
        })
        this.show();
        axios.get("http://127.0.0.1:3000/gameinfo/booktxt").then((res)=>{//小说显示
            if (res.data.code==200){
                this.booklist=res.data.result;
            }
        })
    }
})