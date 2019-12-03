

function book() {
    open('book.html',"_blank")
}
//导航隐藏层
(function () {
    var $nav = $("#nav"),
        $navLi = $nav.find(".mNav"),
        $haveHide = $nav.find(".mainList .haveHide"),
        $ulHide = $nav.find(".ulHide"),
        $allHide = $ulHide.find(".hide"),
        $logo = $nav.find(".logo"),
        $logo2 = $("#logo2");

    $logo2.delay(1000).queue(function(){
        $(this).css({
            left : 60,
            opacity : 1
        });
    });

    $(window).scroll( navScroll() );
    function navScroll() {
        if ( $(document).scrollTop() ){
            $nav.addClass("scroll");
            $logo.stop().fadeIn();
            $logo2.addClass("scale");
        }else{
            $nav.removeClass("scroll");
            $logo.stop().fadeOut();
            $logo2.removeClass("scale");
        }
        return navScroll;
    }

    $navLi.hover(function () {
        $(this).addClass("hover");
    },function () {
        $(this).removeClass("hover");
    });
    $haveHide.hover(function () {
        $ulHide.stop().slideDown();
        $allHide.eq($(this).index("#nav .mainList .haveHide")).stop().fadeIn();
        $nav.addClass("hover");
    },function () {
        $ulHide.stop().slideUp();
        $allHide.eq($(this).index("#nav .mainList .haveHide")).stop().fadeOut();
        $nav.removeClass("hover");
    });

    $allHide.hover(function () {
        $ulHide.stop().slideDown();
        $haveHide.eq($(this).index()).addClass("hover");
        $allHide.eq($(this).index()).stop().fadeIn();
        $nav.addClass("hover");
    },function () {
        $ulHide.stop().slideUp();
        $haveHide.eq($(this).index()).removeClass("hover");
        $allHide.eq($(this).index()).stop().fadeOut();
        $nav.removeClass("hover");
    });
    
})();

//角色动画 + 服务器弹窗
(function () {
    var $role = $('#role'),
        $rol1 = $role.find('.rol1 .role'),
        $rol2 = $role.find(".rol2 .role"),
        $btn = $role.find(".btn"),
        $server = $("#server"),
        $serverList = $("#serverList"),
        $serverClose = $serverList.find(".close"),
        whichShow = false; //false - 第一组显示     true - 第二组显示

    $rol1.removeClass("hide");
    $btn.click(function () {
        whichShow?change($rol2 , $rol1):change($rol1 , $rol2);
        whichShow = !whichShow;
        //console.log($rol1)
    });
    function change($1 , $2) {
        $1.stop();
        $2.stop();
        $1.addClass("hide").delay(900).queue(function () {
            $2.removeClass("hide");
        });
    }

    $server.click(function () {
        $serverList.fadeIn();
        $serverList.find(".main").addClass("show");
    });
    $serverClose.click(function () {
        $serverList.fadeOut();
        $serverList.find(".main").removeClass("show");
    });
})();

//游戏日历
(function () {
    var $slide = $("#slide"),
        $download = $slide.find(".download"),
        $shrink = $download.find(".shrink"),
        $close = $download.find(".close"),
        $downloadMain = $download.find(".downloadMain"),
        $mainLi = $slide.find(".main .mainLi");

    $shrink.click(function () {
        $download.addClass("stretch");
        $(this).hide();
        $downloadMain.show();
    });
    $close.click(function () {
        $download.removeClass("stretch");
        $(this).stop().delay(200).queue(function () {
            $downloadMain.hide();
            $shrink.show();
        })
    });
    $mainLi.hover(function () {
        $(this).stop().addClass("pos");
    },function () {
        $(this).stop().delay(500).queue(function () {
            $(this).removeClass("pos");
        });
    });
})();

/*
 *
    * 左右切换面向对象写法 
    * 占用全局变量  Banr（不带自动）  和   Banr2（带自动）
    * 启动函数  .exe()
 * */
(function(){
    //面向对象写法
    function Banr( $ul , $pic , $tab ) {
        this.$ul = $ul;
        this.$tab = $tab;
        this.index = 0;
        this.length = $pic.length;
        this.width = $pic.width();
        this.timeOut = null;
    }
    Banr.prototype = {
        exe : function () {
            this.addEvent();
        },
        addEvent : function () {
            var This = this;
            this.$tab.mouseenter(function () {
                clearTimeout(This.timeOut);
                var $this = $(this);
                This.timeOut = setTimeout(function () {
                    This.index = This.$tab.index($this);
                    $this.addClass("on").siblings().removeClass("on");
                    This.$ul.stop().animate({
                        left : -This.width*This.index
                    },300);
                },200);
            });
        }
    };

    //继承
    function Banr2($ul , $pic , $tab , $wrap) {
        Banr.call(this,$ul , $pic , $tab);
        this.$wrap = $wrap;
        this.timer = null;
    }
    function Fn(){}
    Fn.prototype = Banr.prototype;
    Banr2.prototype = new Fn();
    Banr2.prototype.temp = Banr2.prototype.exe;
    Banr2.prototype.exe = function () {
        this.temp();
        this.auto();
        this.clearTime();
    };
    Banr2.prototype.clearTime = function () {
        var This = this;
        this.$wrap.hover(function () {
            clearInterval(This.timer);
        },function(){
            This.auto();
        });
    };
    Banr2.prototype.auto = function (){
        var This = this;
        this.timer = setInterval(function () {
            This.index ++;
            This.index %= This.length;
            This.$tab.eq(This.index).addClass("on").siblings().removeClass("on");
            This.$ul.stop().animate({
                left : -This.width*This.index
            },300);
        },3000);
    };
    window.Banr = Banr;
    window.Banr2 = Banr2;
})();

//banner
(function(){
    var $banner = $("#news").find(".banner"),
        $picUl = $banner.find(".pic ul"),
        $picLi = $picUl.children(),
        $tabLi = $banner.find(".tab ul li"),
        banner = new Banr2($picUl , $picLi , $tabLi , $banner);
    banner.exe();
})();

//新闻详细
function detailnew(newid){
    //console.log(a)
    open(`new_detail.html?newid=${newid}`,"blank")
}
//inform,新闻资讯的生成（完成）
(function(){
    axios.get("http://127.0.0.1:3000/gameinfo/gameinfos").then((res)=>{
        var gameInfo=res.data.result;
        var $news = $("#news"),
            $tabLi = $news.find(".inform .tab ul li"),
            $wrapUl = $news.find(".inform .show .wrapUl"),
            $wrapLi =  $wrapUl.find(".wrapLi");
        $tabLi.mouseenter(function () {
            $(this).addClass("on").siblings().removeClass("on");
        });
        $wrapLi.each(function (i) {
            var $ul = $("<ul class='list'></ul>");
            var num = 0;
            for (var j = 0,length=gameInfo.length; j < length; j++) {
                var time=new Date(gameInfo[j].time).toLocaleDateString();
                if (!i || gameInfo[j].type === (i-1) ){
                    $ul.append("<li><p>【"+gameInfo[j].type+"】<a href='javascript:void(0)' onclick='detailnew("+gameInfo[j].ginfo_id+")'>"+gameInfo[j].title+"</a></p><span>"+time+"</span></li>");
                    num ++;
                    if (num == 5)break;
                }
            }
            $(this).append($ul);
        });
        var banner = new Banr($wrapUl,$wrapLi,$tabLi);
        banner.exe();
    });

})();

//论坛游戏生成（完成）
(function () {
    //从数据库读取数据
    $.ajax({
        url:"http://127.0.0.1:3000/gameinfo/info",
        type:"get",
        data:{},
        dataType:"json",
        success:function (res) {
            var gameArr=res.result;//保存从数据库读出来的信息
            var $shishenList = $("#character").find(".shishenList"),
                $mainListUl = $shishenList.find(".mainList .mUl>ul");
            //console.log(arr[1].type);
            //console.log(shishenData.length)

            //生成所有的游戏图标
            var count = [
                [0,null],
                [0,null],
                [0,null],
                [0,null],
                [0,null]
            ];//每个对应的计数器
            for (var i = 0,length=gameArr.length; i < length; i++) {
                var index = 0;
                switch ( gameArr[i].type ){
                    case 1:
                        index = 1;
                        break;
                    case 2:
                        index = 2;
                        break;
                    case 3:
                        index = 3;
                        break;
                    case 4:
                        index = 4;
                        break;
                }
                count[0][0] ++;
                count[index][0] ++;
                if ( count[0][0] % 2 ){
                    count[0][1] = $("<li class='ssList'></li>");
                    $mainListUl.eq(0).append(count[0][1]);
                }
                if ( count[index][0] % 2 ){
                    count[index][1] = $("<li class='ssList'></li>");
                    $mainListUl.eq(index).append(count[index][1]);
                }

                var str = gameArr[i].hot?"<i class='new'></i>":"";
                var $div = $("<div class='shishen'>" +
                    "<img class='lazyImg' src='"+gameArr[i].picture+"'>" +
                    "<p class='cover'><span>"+gameArr[i].game_name+"</span></p>"+str+"</div>");
                var $clone = $div.clone();
                count[0][1].append($div);
                count[index][1].append($clone);
            }
        }
    })



})();

//热门游戏的左右点击
(function () {
    var $character = $('#character'),
        $mUl = $character.find('.shishenList .mainList .mUl'),
        $shishenListTab = $character.find(".shishenTab .clickBtn"),
        width = $mUl.width();

    $shishenListTab.click(function () {
        var i = $(this).index();
        $(this).addClass("on").siblings(".clickBtn").removeClass("on");
        $mUl.eq(i).show().siblings().hide().each(function () {
            var $btn = $(this).children(".btn");
            this.index = 0;
            this.index !== length-1?$btn.eq(1).show():$btn.eq(1).hide();
            this.index !== 0?$btn.eq(0).show():$btn.eq(0).hide();
            $(this).children("ul").css("marginLeft" , 0);
        });
    });

    $mUl.each(function () {//左右点击
        var $ul = $(this).children("ul"),
            $li = $ul.children("li"),
            $btn = $(this).children(".btn"),
            length = Math.ceil($li.length / 6);

        this.index = 0;
        this.index !== length-1?$btn.eq(1).show():$btn.eq(1).hide();
        this.index !== 0?$btn.eq(0).show():$btn.eq(0).hide();

        $btn.click(function () {
            var i = $(this).index(),
                parent = this.parentNode;
            if ( i === 2 ){
                parent.index ++;
                parent.index %= 2;

            }else{
                parent.index --;
                if (parent.index<0) parent.index = 0;
            }

            parent.index !== length-1?$btn.eq(1).show():$btn.eq(1).hide();
            parent.index !== 0?$btn.eq(0).show():$btn.eq(0).hide();

            $ul.stop().animate({
                marginLeft : parent.index * -width
            },300);
        });
    });
})();

//热门用户选项卡切换
(function () {
    var $character = $("#character"),
        $zhujueList = $character.find(".zhujueList"),
        $tabLi = $zhujueList.find(".tab>ul>li"),
        $picLi = $zhujueList.find(".pic>ul>li"),
        $titleTab = $character.find(".sMain .title .tab"),
        $titlePic = $character.find(".sMain .showMain>.mList>.mLi"),
        index = 0;
    $titleTab.click(function () {
        var i = $(this).index("#character .sMain .title .tab");
        $(this).addClass("active").siblings(".tab").removeClass("active");
        $titlePic.eq(i).stop().fadeIn().siblings().stop().fadeOut();
    });
    $tabLi.click(function () {
        index = $(this).index();
        $(this).addClass("active").siblings().removeClass("active");
        $picLi.eq(index).stop().fadeIn().siblings().stop().fadeOut();
    });
})();

//攻略
(function () {
    var $strategy = $("#strategy"),
        $banner = $strategy.find(".leftPart .banner"),
        $picUl = $banner.find(".pic ul"),
        $picLi = $banner.find(".pic ul li"),
        $tabLi = $banner.find(".tab ul li"),
        $right = $strategy.find(".rightPart"),
        $titleTab = $right.find(".title .tab"),
        $ul = $right.find(".mContent ul");
    //左侧banner
    var b1 = new Banr2($picUl , $picLi , $tabLi , $banner);
    b1.exe();


    //右侧选项卡内容生产，攻略列表
    axios.get("http://127.0.0.1:3000/gameinfo/gamestra",
        {params:{
                type:""
            }}).then((res)=>{
        var gameStra=res.data.result;
        //console.log(gameStra);
        $ul.each(function (i) {
            //var num = 0;
            for (var j = 0,length = gameStra.length; j < length; j++) {
                var data = gameStra[j],
                    reg = new RegExp(i-1);//0,1,2,3,4
                var type=parseInt(data.game_id/100)-1;
                if ( !i || reg.test(type) ){//条件判断
                    $(this).append('<li>' +
                        '<a href="strategy_detail.html?stra_id='+data.stra_id+'" target="_blank">' +
                        '<i></i> ' +
                        '<p class="mTitle">【<span class="type">'+data.stra_id+'</span>】&nbsp;'+data.stra_title+'</p> ' +
                        '<p class="author"><span>'+new Date(data.time).toLocaleString()+'</span></p>' +
                        '</a>' +
                        '</li>');
                }
            }
        });

        //右侧选项卡切换
        var b2 = new Banr($right.find('.mContent .show'), $ul , $titleTab);
        b2.exe();
    });

})();
//搜索攻略
function  searchstra() {
    open(`strategy.html?key=${$("#keystra").val()}`,"blank")
}


//热门帖子
function detail(dynamics_id){
    //console.log(a)
    open(`forum_detail.html?dynamics_id=${dynamics_id}`,"blank")
}
(function(){
    axios.get("http://127.0.0.1:3000/user/dynamics").then((res)=>{
        var dynamics=res.data.result.slice(0,8);
        var imgurl="img/index/tzbg.jpg";
        for (var i=0;i<8;i++){
            if (dynamics[i].picture1!=""&&dynamics[i].picture1!=null){
                imgurl=dynamics[i].picture1;
            }
            else {
                imgurl="img/index/tzbg.jpg";
            }
            $("#forumlist").append(`<li>\
                <div class="pic" onclick="detail(${dynamics[i].dynamics_id})">\
                <img src=${imgurl} alt="">\
                <span><b></b></span>\
                </div>\
                <p class="sTitle">${dynamics[i].content_text}</p>\
            </li>`)
        }

    });

})();

function gethotdyn(type,ul) {
    $("#forumlist").children().remove();
    $(ul).addClass("on").siblings().removeClass("on");
    axios.post("http://127.0.0.1:3000/user/getdynbytype",`type=${type}`).then((res)=>{
        var dynamics=res.data.result.slice(0,8);
        if (dynamics.length>8){
            dynamics=dynamics.slice(0,8);
        }
        var imgurl="img/index/tzbg.jpg";
        for (var i=0;i<dynamics.length;i++){
            if (dynamics[i].picture1!=""&&dynamics[i].picture1!=null){
                imgurl=dynamics[i].picture1;
            }
            else {
                imgurl="img/index/tzbg.jpg";
            }
            $("#forumlist").append(`<li>\
                <div class="pic">\
                <img src=${imgurl} alt="">\
                <span><b></b></span>\
                </div>\
                <p class="sTitle">${dynamics[i].content_text}</p>\
            </li>`)
        }
    });
}

//返回顶部
(function(){
    var $goTop = $("#contact").find(".goTop");
    $goTop.click(function () {
        //$(document).scrollTop(0);
        $("body,html").animate({
            scrollTop : 0
        },300);
    });
})();

//最受欢迎用户列表
(function () {
        axios.get("http://127.0.0.1:3000/user/detail").then((res)=> {
            var result=res.data;
            $("#hotname").children().each(function (i,elem) {
                if (i<3){
                    elem.firstChild.data=result[i].uname;
                }
            });
            $("#hotdetail").find(".dec").each(function (i,elem) {
                if (i<3){
                    elem.children[1].innerHTML=result[i].uname;
                    elem.children[2].innerHTML=result[i].introduce;
                }

            })

        })
})();

//根据是否登录显示导航栏的左边
(function () {
    axios.get("http://127.0.0.1:3000/user/isLogin").then((res)=> {
        if (res.data.code==200){
            var uname=res.data.userinfo.uname;
            var $a=$("#nav>.mainList>li:last-child>a");
            $a.css("border-bottom","2px dashed red")
            $a.attr("href","");
            $a.html(uname);

            // var a=`<a href="">uname</a>`;
            // li.replaceWith(a);
        }else{
            var li=$("#nav>.mainList>li:last-child>a");
            var a=`<a href="login.html">登录/注册</a>`;
            li.replaceWith(a);
        }

    })
})();