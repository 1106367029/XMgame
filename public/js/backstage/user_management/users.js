new Vue({
    el:"#content",
    data:{
        uid:"",
        allpage:1,//记录帖子当前的页面是第几页，默认为1
        txtlist:"",//集成书本list
        comlist:"",//楼层的list
        keyword:"",//查找楼层的关键词
        txtid:"",//用于查询的书籍id
    },
    methods:{
        searchbyid(){//以id查找用户
            $("#tbody").children().remove();
            axios.post("http://127.0.0.1:3000/controller/searchuser",`uid=${this.uid}`).then(function (res) {
                if (res.data.code==200){
                    //console.log("搜索成功",res.data.result);
                    var result=res.data.result[0];
                    var time=new Date(result.reg_data).toLocaleString();
                    $("#tbody").prepend(`<tr><td ><input type="checkbox" value="2"></td>\
                                            <td>${result.uid}</td><td>${result.uname}</td>\
                                            <td>${result.email}</td><td>${result.phone}</td>\
                                            <td>${result.age}</td><td>${result.gender}</td>\
                                            <td>${result.pictrue}</td><td>${time}</td>\
                                            <td>${result.introduce}</td><td><a href="javascript:" class="active" onclick="deleteuser(${result.uid},this)">\
                                            <i class="icon-remove icon-large text-danger text-active"></i>\
                                            </a></td></tr>`);
                    $("#page").css("display","none");
                }
                else {
                    alert(res.data.msg);
                }
            })
        },
        showall(){//搜索所有的用户
            $("#tbody").children().remove();
            $("#page").css("display","block");
            axios.get("http://127.0.0.1:3000/controller/alluser").then(function (res) {
                if (res.data.code==200){
                    var allpage=res.data.result.length/8;//分的页数
                    console.log(this.allpage);
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
                    for (var i=0;i<results.length;i++){
                        var result=results[i];
                        var time=new Date(result.reg_data).toLocaleString();
                        $("#tbody").append(`<tr><td ><input type="checkbox" value="2"></td>\
                                            <td>${result.uid}</td><td>${result.uname}</td>\
                                            <td>${result.email}</td><td>${result.phone}</td>\
                                            <td>${result.age}</td><td>${result.gender}</td>\
                                            <td>${result.pictrue}</td><td>${time}</td>\
                                            <td>${result.introduce}</td><td>\
                                            <a href="javascript:" class="active" onclick="deleteuser(${result.uid},this)">\
                                            <i class="icon-remove icon-large text-danger text-active"></i>\
                                            </a></td></tr>`);
                    }

                }
                else {
                    alert("没有用户");
                }
            })
        },
        deleteuser(uid,tr){//删除用户
            if(confirm(`是否真的删除" ${uid} "这个用户新闻`)){
                axios.post("http://127.0.0.1:3000/user/deluser",`uid=${uid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        $(tr).parent().parent().remove();//移除已经删除的用户

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
        alltxt(){//查看所有集成书籍
            axios.get("http://127.0.0.1:3000/gameinfo/booktxt").then((res)=>{//小说显示
                if (res.data.code==200){
                    var result=res.data.result;
                    for (var i=0;i<result.length;i++){
                        result[i].time=new Date(result[i].time).toLocaleString();
                    }
                    this.txtlist=result;
                }
            })
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
        },
        allcomment(){
            axios.get("http://127.0.0.1:3000/gameinfo/book").then((res)=> {
                if (res.data.code == 200) {//搜索活动的所有楼层显示
                    var result=res.data.result;
                    for (var i=0;i<result.length;i++){
                        result[i].time=new Date(result[i].time).toLocaleString();
                    }
                    this.comlist=result;
                }
            })
        },
        deletetxt(tr){//删除书本
            var tr=$(tr).parent().parent();
            var txtid=$(tr).find("td:nth-child(1)").html();
            if(confirm(`是否真的删除" ${txtid} "这个用户新闻`)){
                axios.post("http://127.0.0.1:3000/gameinfo/delbooktxt",`txtid=${txtid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        $(tr).remove();

                    }else {
                        alert(res.data.msg)
                    }
                });
            }

        },
        deletecomment(tr){//删除楼层内容
            var tr=$(tr).parent().parent();
            var b_id=$(tr).find("td:nth-child(1)").html();
            if(confirm(`是否真的删除" ${b_id} "这个用户新闻`)){
                axios.post("http://127.0.0.1:3000/gameinfo/delbook",`b_id=${b_id}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        $(tr).remove();

                    }else {
                        alert(res.data.msg)
                    }
                });
            }
        },
        selkey(){//根据关键词查找楼层
            axios.post("http://127.0.0.1:3000/gameinfo/keybook",`key=${this.keyword}`).then((res)=>{//小说显示
                if (res.data.code==200){
                    var result=res.data.result;
                    for (var i=0;i<result.length;i++){
                        result[i].time=new Date(result[i].time).toLocaleString();
                    }
                    this.comlist=result;
                }
                else {
                    alert(res.data.msg);
                    this.comlist="";
                }
            })
        },
        seltxt(){//根据用户id查找书籍
            axios.post("http://127.0.0.1:3000/gameinfo/idbooktxt",`txtid=${this.txtid}`).then((res)=>{//小说显示
                if (res.data.code==200){
                    var result=res.data.result;
                    for (var i=0;i<result.length;i++){
                        result[i].time=new Date(result[i].time).toLocaleString();
                    }
                    this.txtlist=result;
                }
                else {
                    alert(res.data.msg);
                    this.txtlist="";
                }
            })

        }

    },
    created(){
        window.deleteuser=this.deleteuser;
        window.deletetxt=this.deletetxt;
        window.deletecomment=this.deletecomment;
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
            if (islogin.code==200){//登录了
                var cid=islogin.cinfo.cid;
                $("#cid").html(cid);

            }else {//没有登录
                alert("请登录");
                location.replace("bs_login.html")
            }
        })
    }
})