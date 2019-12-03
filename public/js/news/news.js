new Vue({
    el:".white",
    data:{
        newArr:"",
        allpage:1,//记录帖子当前的页面是第几页，默认为1
    },
    methods:{
        getnewsarr(){
            axios.get("http://127.0.0.1:3000/gameinfo/gameinfos").then((res)=>{
                var allpage=res.data.result.length/8;//分的页数
                if (allpage==parseInt(allpage)){//整除
                    allpage=parseInt(allpage);
                }
                else{//没整除
                    allpage=parseInt(allpage)+1;
                }
                this.allpage=allpage;
                console.log(allpage);
                //分页
                $(".next").prev().prev().children("a").html(allpage);//改变页面的总页
                var a=$("#page").find(".active").children("a");//获得页数a标签
                var page=Number($(a).html());
                var result=res.data.result.slice((page-1)*8,8*page);
                for(var i=0;i<result.length;i++){
                    var time=result[i].time;
                    result[i].time=new Date(time).toLocaleString();//日期转为本地格式
                    if (result[i].source==""||result[i].source==null){
                        result[i].source="本平台"
                    }
                }
                this.newArr=result;
            })

        },
        detail(newid){
            //console.log(a)
            open(`new_detail.html?newid=${newid}`,"blank")
        },
        nextpage(){//下一页
            var a=$("#page").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            var allpage=Number($(".next").prev().prev().children("a").html());
            if (page>=allpage){
                alert("这已经是最后一页")
            }else {
                $(a).html(page+1);
                this.getnewsarr();
            }
        },
        prevpage(){
            var a=$("#page").find(".active").children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            if (page<=1){
                alert("这已经是第一页")
            }else {
                $(a).html(page-1);
                this.getnewsarr();
            }
        },
        firstpage(){//分页点击首页按钮
            var a=$("#page").find(".active").children("a");//获得a标签
            $(a).html(1);
            this.getnewsarr();
        },
        lastpage(){
            var a=$("#page").find(".active").next().next().children("a");//获得a标签
            var page=Number($(a).html());//获得当前页面
            $("#page").find(".active").children("a").html(page);
            this.getnewsarr();
        },

    },
    created(){
        this.getnewsarr();
    }
})