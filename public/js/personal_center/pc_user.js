new Vue({
    el:".lmlblog-member-main",
    data:{
        uname:"",uid:"",gender:"",age:"",phone:"",email:"",introduce:"",
        dynamics:"",//用户发布的帖子
        allpage:1,//记录帖子当前的页面是第几页，默认为1
        imgurl:"",
        statu:false,//表示没有登录
        loginuid:"",//当前登录的用户id
        sxcontent:"",//发送的私信的内容
    },
    methods:{
        getuser(){//首次加载个人中心
            var uid=location.search.slice(5);
            this.dynamics="";
            axios.post("http://127.0.0.1:3000/user/userbyid",`uid=${uid}`).then((res)=>{
                var result=res.data;
                var user=result.result[0];
                this.uname=user.uname;
                this.uid=user.uid;
                if (user.gender==1){
                    this.gender="男";
                }
                else{
                    this.gender="女";
                }
                this.age=user.age;
                this.phone=user.phone;
                this.email=user.email;
                this.introduce=user.introduce;
                this.imgurl=user.picture;
                if (result.code==200){
                    var allpage=result.dynamics.length/4;//分的页数
                    if (allpage==parseInt(allpage)){//整除
                        allpage=parseInt(allpage);
                    }
                    else{//没整除
                        allpage=parseInt(allpage)+1;
                    }
                    this.allpage=allpage;
                    //分页
                    $("#allpage").html(allpage);//改变页面的总页
                    var a=$("#startpage");//获得页数a标签
                    var page=Number($(a).html());
                    var resu=result.dynamics.slice((page-1)*4,4*page);
                    for (var i=0;i<resu.length;i++){
                        resu[i].creation_time=new Date(resu[i].creation_time).toLocaleString();
                    }
                    this.dynamics=resu;
                }
                else {
                    $(".lmlblog-post-list").prepend(`<h1 style="color: red;font-size: 30px;margin:20px 20px 20px 0">此用户没有发布动态</h1>`)
                }
            })
        },
        nextpage(){//下一页
            var page=Number($("#startpage").html());//获得当前页面
            var allpage=Number($("#allpage").html());
            if (page>=allpage){''
                alert("这已经是最后一页")
            }else {
                $("#startpage").html(page+1);
                this.getuser();
            }
        },
        prevpage(){
            var page=Number($("#startpage").html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $("#startpage").html(page-1);
                this.getuser();
            }
        },
        gz(){//关注
            var uid=location.search.slice(5);
            if (this.statu==true){//关注
                axios.post("http://127.0.0.1:3000/user/gzuser",`uid=${uid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg)
                    }else {
                        alert(res.data.msg)
                    }
                });
            }else {
                if (confirm("登录才可以关注！"))
                {
                    location.href="login.html";
                }

            }
        },
        talk(){//聊天
            if (this.statu==true){//关注
                var uid=location.search.slice(5);
                //给要聊天的人发送一条聊天邀请，如果对方在线而且同意就可以聊天
                axios.post("http://127.0.0.1:3000/user/sendmsg",`from_id=${this.loginuid}&to_id=${uid}&content=0`).then((res)=>{
                    if (res.data.code==200){
                        open(`http://localhost:3000/client.html?cid=${this.loginuid}&sid=${uid}`,"_blank")
                    }else {
                        alert(res.data.msg)
                    }
                });

            }else {
                if (confirm("登录才可以请求聊天！"))
                {
                    location.href="login.html";
                }

            }

        },
        sendsx(){//发送私信
            var uid=location.search.slice(5);
            if (this.sxcontent!=""){
                if (this.statu==true){//发送私信
                    axios.post("http://127.0.0.1:3000/user/sendmsg",`from_id=${this.loginuid}&to_id=${uid}&content=${this.sxcontent}`).then((res)=>{
                        if (res.data.code==200){
                            alert(res.data.msg);
                            this.sxcontent=""
                        }else {
                            alert(res.data.msg)
                        }
                    });
                }else {
                    if (confirm("登录才可以发送私信！"))
                    {
                        location.href="login.html";
                    }

                }
            }else {
                alert("发送的内容不可以为空")
            }

        },
        detail(dynamics_id){//查看帖子详情
            open(`forum_detail.html?dynamics_id=${dynamics_id}`,"blank")
        },
    },
    created(){
        axios.get("http://127.0.0.1:3000/user/isLogin").then((res)=>{
            if (res.data.code==200){//判断是否登录了
                this.statu=true;
                this.loginuid=res.data.userinfo.uid;
            }else {
                this.statu=false;
                console.log(res.data)
            }
        });
        this.getuser();

    },
    mounted(){
    },
    update(){

    }
})