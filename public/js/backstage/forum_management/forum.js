new Vue({
    el:"#content",
    data:{
        searchword:"",//帖子搜索词
        dynamicslist:"",//帖子列表
        pllist:"",//一级评论列表
        dnyid:"",//评论搜索的帖子id
        allpage:1,//记录帖子当前的页面是第几页，默认为1
        plallpage:1,
        secondid:"",//二级评论id
        secondpl:"",//二级评论列表
    },
    methods:{
        search(){//帖子搜索
            var optionval=$("#searchtype>option:selected").val();
            if (optionval==0){
                alert("请选择搜索的类型");
            }
            else if (optionval==1){//关键词搜索
                axios.post("http://127.0.0.1:3000/controller/seldynbykey",`keyword=${this.searchword}`).then((res)=>{
                    if (res.data.code==200){
                       var result=res.data.result;
                        for(var i=0;i<result.length;i++){
                            var time=result[i].creation_time;
                            result[i].creation_time=new Date(time).toLocaleString();//日期转为本地格式
                        }
                        this.dynamicslist=result;
                    }
                    else {
                        alert(res.data.msg);
                        this.dynamicslist="";
                    }
                })

            }
            else if (optionval==2){//帖子id搜索
                //alert("帖子id搜索")
                axios.post("http://127.0.0.1:3000/user/getdynbyid",`dynamics_id=${this.searchword}`).then((res)=>{
                    //console.log(res.data)
                    if (res.data.code==200){
                        var result=res.data.result;
                        var time= result[0].creation_time;
                        time=new Date(time).toLocaleString();
                        result[0].creation_time=time;
                        this.dynamicslist=result;
                    }
                    else {
                        alert(res.data.msg);
                        this.dynamicslist="";
                    }
                })

            }else {//用户id搜索
                axios.post("http://127.0.0.1:3000/controller/getdynbyuid",`uid=${this.searchword}`).then((res)=>{
                    if (res.data.code==200){
                        var result=res.data.result;
                        for(var i=0;i<result.length;i++){
                            var time=result[i].creation_time;
                            result[i].creation_time=new Date(time).toLocaleString();//日期转为本地格式
                        }
                        this.dynamicslist=result;
                    }
                    else {
                        alert(res.data.msg);
                        this.dynamicslist="";
                    }
                })
            }
        },
        showalldyn(){//查询所有帖子的按钮
            $("#tzpage").css("display","block");
            axios.get("http://127.0.0.1:3000/user/dynamics").then((res)=>{
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
                    $("#tznext").prev().prev().children("a").html(allpage);//改变页面的总页
                    var a=$("#tzpage").find(".active").children("a");//获得页数a标签
                    var page=Number($(a).html());
                    var result=res.data.result.slice((page-1)*8,8*page);
                    for(var i=0;i<result.length;i++){
                        var time=result[i].creation_time;
                        result[i].creation_time=new Date(time).toLocaleString();//日期转为本地格式
                    }
                    this.dynamicslist=result;
                }
                else {
                    alert(res.data.msg);
                    this.dynamicslist="";
                }
            })

        },
        deletedyn(td){//删除当前帖子
            var tr=$(td).parent().parent();
            var dynid=$(tr).find("td:nth-child(1)").html();
            //console.log(dynid)
            if (confirm(`确定要删除id为：“${dynid}的这条用户帖吗？”`)){
                axios.post("http://127.0.0.1:3000/user/deletedyn",`dynamics_id=${dynid}`).then((res)=>{
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
        searchpl(){
            $("#plpage").css("display","block");
            //根据帖子id搜索评论
            axios.post("http://127.0.0.1:3000/controller/getplbydynid",`dynamics_id=${this.dnyid}`).then((res)=>{
                if (res.data.code==200){
                    var allpage=res.data.result.length/8;//分的页数
                    this.plallpage=allpage;
                    if (allpage==parseInt(allpage)){//整除
                        allpage=parseInt(allpage);
                    }
                    else{//没整除
                        allpage=parseInt(allpage)+1;
                    }
                    //分页
                    $("#plnext").prev().prev().children("a").html(allpage);//改变页面的总页
                    var a=$("#plpage").find(".active").children("a");//获得页数a标签
                    var page=Number($(a).html());
                    var result=res.data.result.slice((page-1)*8,8*page);
                    for(var i=0;i<result.length;i++){
                        var time=result[i].time;
                        result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                    }
                    this.pllist=result;
                }
                else {
                    alert(res.data.msg);
                    this.pllist="";
                }
            })
        },
        deletepl(a){
            var tr=$(a).parent().parent();
            var plid=$(tr).find("td:nth-child(1)").html();
            if (confirm(`确定要删除id为：“${plid}的这条用户帖吗？”`)){
                axios.post("http://127.0.0.1:3000/controller/delpl",`comment_id=${plid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        //页面上删除
                        $(tr).remove();
                        location.reload(true);

                    }
                    else {
                        alert(res.data.msg);
                    }
                })
            }
        },
        tznextpage(){//下一页
            var a=$("#tzpage").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page>=this.allpage){
                alert("这已经是最后一页")
            }else {
                $(a).html(page+1);
                this.showalldyn();
            }
        },
        tzprevpage(){
            var a=$("#tzpage").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $(a).html(page-1);
                this.showalldyn();
            }
        },
        firstpage(){//分页点击首页按钮
            var a=$("#tzpage").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.showalldyn();
        },
        lastpage(){
            var a=$("#tzpage").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#tzpage").find(".active").children("a").html(page);
            this.showalldyn();
        },
        plnextpage(){//下一页
            var a=$("#plpage").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page>=this.plallpage){
                alert("这已经是最后一页")
            }else {
                $(a).html(page+1);
                this.searchpl();
            }
        },
        plprevpage(){
            var a=$("#plpage").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $(a).html(page-1);
                this.searchpl();
            }
        },
        plfirstpage(){//分页点击首页按钮
            var a=$("#plpage").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.searchpl();
        },
        pllastpage(){
            var a=$("#plpage").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#plpage").find(".active").children("a").html(page);
            this.searchpl();
        },
        secondsearch(){
            //二级评论搜索
            axios.post("http://127.0.0.1:3000/controller/secondcom",`comment_id=${this.secondid}`).then((res)=>{
                if (res.data.code==200){
                    var result=res.data.result;
                    for(var i=0;i<result.length;i++){
                        var time=result[i].time;
                        result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                    }

                    this.secondpl=result;
                }
                else {
                    alert(res.data.msg);
                    this.secondpl="";
                }
            })
        },
        delsencondpl(a){//删除二级评论
            var tr=$(a).parent().parent();
            var scid=$(tr).find("td:nth-child(1)").html();
            if (confirm(`确定要删除id为：“${scid}的这条用户帖吗？”`)){
                axios.post("http://127.0.0.1:3000/controller/delsecondcom",`scid=${scid}`).then((res)=>{
                    if (res.data.code==200){
                        alert(res.data.msg);
                        //页面上删除
                        $(tr).remove();
                        location.reload(true);

                    }
                    else {
                        alert(res.data.msg);
                    }
                })
            }
        }
    },
    created(){
        window.deletedyn=this.deletedyn;
        window.deletepl=this.deletepl;
        window.delsencondpl=this.delsencondpl;
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