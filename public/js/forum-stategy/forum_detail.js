new Vue({
    el:".single",
    data:{
        dynamics_id:"",
        content_title:"",creation_time:"",praise_num:"",content_text:"",
        uname:"",introduce:"",uid:"",picture:"",
        arrdyn:"",
        pllist:"",//评论
        plcontent:"",//评论的内容
        plnum:0,//评论的条数
        spllist:"",//二级评论列表
        replayshow:false,//控制回复二级评论的显隐
        scontent:"",//二级评论的内容
    },
    methods:{
        comment(){//发表评论
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
                    axios.post("http://127.0.0.1:3000/user/comment",`dynamics_id=${this.dynamics_id}&content=${this.plcontent}&uid=${uid}`).then((res)=>{
                        if (res.data.code==200){//搜索帖子的评论
                            alert(res.data.msg);
                            this.plcontent="";
                        }
                        else {
                            alert(res.data.msg)
                        }
                    })

                }else{
                    if (confirm("登录了才可发表评论")){
                        open("login.html","_self")
                    }
                }
            })


        },
        openpl_pl(e,plid) {
            var a=e.target;
            this.spllist="";
            axios.post("http://127.0.0.1:3000/user/secondcbyid",`comment_id=${plid}`).then((res)=>{
                if (res.data.code==200){//搜索帖子的评论
                    var result=res.data.result;
                    for (var i=0;i<result.length;i++){
                        result[i].time=new Date(result[i].time).toLocaleString();
                    }
                    this.spllist=result;
                }
                else {
                    alert(res.data.msg);
                }
            })
            setTimeout(()=>{
                if ($(a).html()=="展开评论")
                {
                    $(a).parent().nextAll().css("display","block");
                    $(a).html("关闭评论");
                }
                else {
                    $(a).parent().nextAll().css("display","none");
                    $(a).parent().parent().find("footer").css("display","block");
                    $(a).html("展开评论");
                    this.spllist="";
                }
            },500)


        },
        showreplay(e){//展开回复输入框
            var a=e.target;
            if ($(a).html()=="回复")
            {
                $(a).parent().next().css("display","block");
                $(a).html("收起");
            }else {
                $(a).html("回复");
                $(a).parent().next().css("display","none")
            }
        },
        replay(comment_id){//回复二级评论
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
                    axios.post("http://127.0.0.1:3000/user/scomment",`comment_id=${comment_id}&content=${this.scontent}&uid=${uid}`).then((res)=>{
                        if (res.data.code==200){
                            alert(res.data.msg);
                            this.scontent="";
                        }
                        else {
                            alert(res.data.msg)
                        }
                    })

                }else{
                    if (confirm("登录了才可发表评论")){
                        open("login.html","_self")
                    }
                }
            })

        },
        detail(dynamics_id){
            //console.log(a)
            open(`forum_detail.html?dynamics_id=${dynamics_id}`,"blank")
        },


    },
    created(){
        this.dynamics_id=location.search.slice(13);
        axios.post("http://127.0.0.1:3000/user/getdynbyid",`dynamics_id=${this.dynamics_id}`).then((res)=>{
            if (res.data.code==200){
                var result=res.data.result[0];
                this.content_title=result.content_title;
                this.creation_time=new Date(result.creation_time).toLocaleString();
                this.praise_num=result.praise_num;
                this.uname=result.uname;
                this.picture=result.picture;
                this.introduce=result.introduce;
                this.content_text=result.content_text;
                if (result.picture3!=null&&result.picture3!=""){
                    $(".featured").append(`<p><img src="${result.picture1}" width="80%"></p><p><img src="${result.picture2}" width="80%"></p><img src="${result.picture3}" width="80%">`)
                }
                else if (result.picture2!=null&&result.picture2!=""){
                    $(".featured").append(`<p><img src="${result.picture1}" width="80%"></p><img src="${result.picture2}" width="80%">`)
                }
                else if (result.picture1!=null&&result.picture1!="") {
                    $(".featured").append(`<img src="${result.picture1}" width="80%">`)
                }else {}
            }else {
                console.log(res.data)
            }
        });
        axios.get("http://127.0.0.1:3000/user/dynamics").then((res)=>{//猜你喜欢
            if (res.data.code==200){
                var result=res.data.result.slice(0,3);
                for(var i=0;i<result.length;i++){
                    var time=result[i].creation_time;
                    result[i].creation_time=new Date(time).toLocaleString();//日期转为本地格式
                    if (result[i].picture1!=null&&result[i].picture1!=""){
                        result[i].picture1=result[i].picture1;
                    }else {
                        result[i].picture1="img/forum/img10.jpg"
                    }
                }
                this.arrdyn=result;
            }else {
                console.log(res.data)
            }
        });
        axios.post("http://127.0.0.1:3000/controller/getplbydynid",`dynamics_id=${this.dynamics_id}`).then((res)=>{
            if (res.data.code==200){//搜索帖子的评论
                var result=res.data.result;
                this.plnum=result.length;
                for(var i=0;i<result.length;i++){
                    var time=result[i].time;
                    result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                }
                this.pllist=result;
            }
        })

    }
})