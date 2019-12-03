new Vue({
    el:"#forum",
    data:{
        dynamics:"",
        hotdynamics:"",//侧边的热门推荐
        alldynamics:"",
        islogin:{},
        tzlist:{},
        statu:false,//表示没有登录
        allpage:1,//记录当前的页面是第几页，默认为1
        pc_uname:"",pc_picture:"",pc_introduce:"",pc_uid:"",//查看用户信息的弹窗
    },
    methods:{
        loading(){//初始化显示四条攻略列表，区分是否点赞
            if (this.statu==true){
                $.when($.ajax(
                    {
                        async: false,//同步
                        url : "http://127.0.0.1:3000/user/isLogin",//判断是否登录
                        dataType: "JSON",
                        type: "GET",
                        success: function (data) {
                        }
                    }),
                    $.ajax(
                        {
                            async: false,
                            url : "http://127.0.0.1:3000/user/dynamics",//获取帖子列表
                            dataType: "JSON",
                            type: "GET",
                            success: function (data) {
                            }
                        })
                ).done((user,tzlist)=> {
                    var uid=user[0].userinfo.uid;
                    var uname=user[0].userinfo.uname;
                    var islogin=user[0].code;
                    var tzlist=tzlist[0].result;
                    //分页start
                    var allpage=tzlist.length/8;//分的页数
                    if (allpage==parseInt(allpage)){//整除
                        allpage=parseInt(allpage);
                    }
                    else{//没整除
                        allpage=parseInt(allpage)+1;
                    }
                    this.allpage=allpage;
                    //分页
                    $("#page>ul").find(".next").prev().prev().children("a").html(allpage);//改变页面的总页
                    var a=$("#page>ul").find(".active").children("a");//获得页数a标签
                    var page=Number($(a).html());
                    this.hotdynamics=tzlist.slice(4,8);

                    tzlist=tzlist.slice((page-1)*8,8*page);
                    //分页end
                    var currentIndex=0;//控制递归的条件
                    if (islogin==200){
                        function newRequest(){//利用递归遍历帖子列表，查看当前用户是否点赞某条文章
                            if(currentIndex>=tzlist.length){
                                return; //callback
                            }
                            var dynamics_id = tzlist[currentIndex].dynamics_id;//当前遍历的攻略的id
                            $.ajax({
                                url: "http://127.0.0.1:3000/user/isdianzan",
                                type: 'post',
                                data:`dynamics_id=${dynamics_id}&uid=${uid}`,
                                async: false,
                                dataType: 'json',
                            }).then((res)=>{//获取用户是否点赞的信息
                                var code=res.code;//用户是否点赞此条攻略的判断条件
                                var result=res.result;
                                var title=result[0].content_text;
                                var imgurl="img/forum/img10.jpg";
                                if (result[0].picture1!=null&&result[0].picture1!=""){
                                    imgurl=result[0].picture1;
                                }
                                var time=new Date(result[0].creation_time).toLocaleString();
                                var lovenum=result[0].praise_num;
                                var aclass="love";//点赞标签的样式
                                var iclass="ion-android-favorite-outline";
                                var pcuname=tzlist[currentIndex].uname;
                                if (code==true){
                                    aclass="love active";
                                    iclass="ion-android-favorite";
                                }
                                $("#page").before(
                                    `<article class="col-md-12 article-list">\
								<div class="inner">\
								<figure><a href="javascript:"><img src="${imgurl}" width="100%" height="100%"></a></figure>\
								<div class="details">\
								<div class="detail">\
								<div class="category"><a onclick="usercard(${tzlist[currentIndex].uid},'${pcuname}','${tzlist[currentIndex].picture}','${tzlist[currentIndex].introduce}')" href="javascript:">${tzlist[currentIndex].uname}&nbsp; &nbsp;</a></div>\
								<time>${time}</time>\
								</div>\
								<h1 style="height: 115px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;"><a href="single.html">${title}</a></h1>\
								<footer>\
								<a href="javascript:" class="${aclass}" onclick="love(${dynamics_id})">\
								<i class="${iclass}"></i>\
								<div>${lovenum}</div>\
								<div style="display: none">${dynamics_id}</div>\
								</a>\
								<a class="btn btn-primary more" onclick="detail(${dynamics_id})" href="javascript:">\
								<div>详细</div>\
								<div><i class="ion-ios-arrow-thin-right"></i></div>\
								</a>\
								</footer></div></div></article>`);
                                currentIndex++;
                                newRequest();
                            });
                        }
                        newRequest();
                    }
                    else {//如果用户没有登录的时候执行
                        console.log("请登录");

                    }
                }).fail(function(err){//当前面三个请求某一个出错时候
                    alert(err);
                })
            }
            else {
                //没登陆
                axios.get("http://127.0.0.1:3000/user/dynamics",{params:{type:""}}).then((res)=>{
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
                    this.hotdynamics=res.data.result.slice(4,8);//侧边推荐
                    var result=res.data.result.slice((page-1)*8,8*page);
                    for (var i=0;i<result.length;i++){
                        result[i].creation_time=new Date(result[i].creation_time).toLocaleString();
                        if (result[i].picture1!=null&&result[i].picture1!=""){
                            result[i].picture1=result[i].picture1;
                        }else {
                            result[i].picture1="img/forum/img10.jpg"
                        }
                    }

                    this.dynamics=result;
                })
            }

        },
        love(dynamics_id){//点赞
            if (this.statu==true){
                var lovea=event.currentTarget;//event.target返回触发事件的元素
                //event.currentTarget返回绑定事件的元素
                //这里指a标签，输出要使用$(lovea)，调用直接用名字
                //console.log($(lovea));
                var test=lovea.className.match(/active/ig);//查看a的样式是否包括active
                var love=Number(lovea.innerText);//当前点赞的人数
                if (test==null){//点赞
                    lovea.children[0].setAttribute("class","ion-android-favorite");//i标签的已经点赞样式
                    lovea.setAttribute("class","love active");//a标签已经点赞样式
                    love+=1;
                    axios.post("http://127.0.0.1:3000/user/addlovenum",`dynamics_id=${dynamics_id}&love=${love}`).then((res)=>{
                        if (res.data.code==true){
                            console.log("点赞成功");
                            lovea.children[1].innerHTML=love;

                        }

                        //将点赞的用户id加入攻略表的love_users
                    });
                }
                else {//取消点赞
                    lovea.children[0].setAttribute("class","ion-android-favorite-outline");
                    lovea.setAttribute("class","love");
                    love-=1;
                    axios.post("http://127.0.0.1:3000/user/dellovenum",`dynamics_id=${dynamics_id}&love=${love}`).then((res)=>{
                        //取消点赞成功
                        console.log("取消点赞成功");
                        lovea.children[1].innerHTML=love;
                        //将点赞的用户id从攻略表的love_users中移除
                    })
                }
            }
            else {
                if (confirm("登录了才可以点赞，是否前往登录？")){
                    location.href="login.html";
                }
            }

        },
        detail(dynamics_id){
            //console.log(a)
            open(`forum_detail.html?dynamics_id=${dynamics_id}`,"_blank")
        },
        nextpage(){//下一页
            var a=$("#page>ul").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page>=this.allpage){
                alert("这已经是最后一页")
            }
            else {
                if (this.statu==true){//已经登录
                    $("#page").siblings("article").remove();
                }
                $(a).html(page+1);
                this.loading();
            }
        },
        prevpage(){
            var a=$("#page>ul").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                if (this.statu==true){
                    $("#page").siblings("article").remove();
                }
                $(a).html(page-1);
                this.loading();
            }
        },
        firstpage(){//分页点击首页按钮
            if (this.statu==true){
                $("#page").siblings("article").remove();
            }
            var a=$("#page>ul").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.loading();
        },
        lastpage(){
            if (this.statu==true){
                $("#page").siblings("article").remove();
            }
            var a=$("#page>ul").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#page>ul").find(".active").children("a").html(page);
            this.loading();
        },
        usercard(uid,uname,picture,introduce){//个人介绍弹窗
            this.pc_uname=uname;
            this.pc_picture=picture;
            this.pc_introduce=introduce;
            this.pc_uid=uid;
            $('#myModal').modal();
        },
        gz(uid){//关注
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
        }
    },
    created(){
        axios.get("http://127.0.0.1:3000/user/isLogin").then((res)=>{
            if (res.data.code==200){//判断是否登录了
                this.statu=true;
                this.loading();
            }else {
                this.statu=false;
                this.loading();
            }
        });
        window.love=this.love;//自动生成元素的onclick事件
        window.loading=this.loading;
        window.detail=this.detail;
        window.usercard=this.usercard;
    },
    mounted(){//可以进行dom操作

    },
})