new Vue({
	el:"#strategy",
	data:{
		arr:"",
		allclass:"tabbg", dyclass:"",syclass:"",xsclass:"",qzclass:"",
		islogin:{},
		gllist:{},
		statu:false,//表示没有登录
        uid:null,//记录登录的用户id
		allpage:1,//记录当前的页面是第几页，默认为1
	},
	methods:{
		all(){
			this.allclass="tabbg";
			this.dyclass="";
			this.syclass="";
			this.xsclass="";
			this.qzclass="";
			$("#page>ul").find(".active").children("a").html(1);
			if (this.statu==true){//登录了
				$("#stralist>div:last-child").prevAll().remove();

				this.loading("");
			}else {//没登录
				this.loading("");
			}

		},
		dy(){//端游
			this.allclass="";
			this.dyclass="tabbg";
			this.syclass="";
			this.xsclass="";
			this.qzclass="";
			$("#page>ul").find(".active").children("a").html(1);
			if (this.statu==true){//登录了
				$("#stralist>div:last-child").prevAll().remove();
				this.loading(1);
			}else {//没登录
				this.loading(1);
			}
		},
		sy(){//手游
			this.allclass="";
			this.dyclass="";
			this.syclass="tabbg";
			this.xsclass="";
			this.qzclass="";
			$("#page>ul").find(".active").children("a").html(1);
			if (this.statu==true){//登录了
				$("#stralist>div:last-child").prevAll().remove();
				this.loading(2);
			}else {//没登录
				this.loading(2);
			}
		},
		xs(){//现实
			this.allclass="";
			this.dyclass="";
			this.syclass="";
			this.xsclass="tabbg";
			this.qzclass="";
			$("#page>ul").find(".active").children("a").html(1);
			if (this.statu==true){//登录了
				$("#stralist>div:last-child").prevAll().remove();
				this.loading(3);
			}else {//没登录
				this.loading(3);
			}

		},
		qz(){//亲子
			this.allclass="";
			this.dyclass="";
			this.syclass="";
			this.xsclass="";
			this.qzclass="tabbg";
			$("#page>ul").find(".active").children("a").html(1);
			if (this.statu==true){//登录了
				$("#stralist>div:last-child").prevAll().remove();
				this.loading(4);
			}else {//没登录
				this.loading(4);
			}
		},
		loading(gametype){//初始化显示四条攻略列表，区分是否点赞 //gametype用来区分游戏类型
			if (this.statu==true){//登录了执行的语句
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
							url : "http://127.0.0.1:3000/gameinfo/gamestra",//获取攻略列表
							data:{type:gametype},//用作游戏类型的判断
							dataType: "JSON",
							type: "GET",
							success: function (data) {
							}
						})
				).done( (user,gllist)=> {
					var uid=user[0].userinfo.uid;
					var uname=user[0].userinfo.uname;
					var islogin=user[0].code;
					var gllist=gllist[0].result;//循环显示的攻略列表
					//分页start
					var allpage=gllist.length/8;//分的页数
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
					gllist=gllist.slice((page-1)*8,8*page);
					//分页end
					var currentIndex=0;//控制递归的条件
					if (islogin==200){
						function newRequest(){//利用递归遍历攻略列表，查看当前用户是否点赞某条文章
							if(currentIndex>=gllist.length){
								return; //callback
							}
							var stra_id = gllist[currentIndex].stra_id;//当前遍历的攻略的id
							$.ajax({
								url: "http://127.0.0.1:3000/gameinfo/isDianzan",
								type: 'post',
								data:`stra_id=${stra_id}&uid=${uid}`,
								async: false,
								dataType: 'json',
							}).then((res)=>{//获取用户是否点赞的信息
								var code=res.code;//用户是否点赞此条攻略的判断条件
								var result=res.result;
								var title=result[0].stra_title;
								var imgurl="img/forum/img10.jpg";
								if (result[0].picture!=null){
									var img=result[0].picture.split(',');
									imgurl=img[0];
								}
								var content=result[0].content1.slice(0,100)+"...";
								var time=new Date(result[0].time).toLocaleString();
								var lovenum=result[0].love;
								var aclass="love";//点赞标签的样式
								var iclass="ion-android-favorite-outline";
								if (code==true){
									aclass="love active";
									iclass="ion-android-favorite";
								}
								$("#page").before(
									`<article class="col-md-12 article-list">\
								<div class="inner">\
								<figure><a href="single.html"><img src="${imgurl}" width="100%" height="100%"></a></figure>\
								<div class="details">\
								<div class="detail">\
								<div class="category"><a href="#">${uname}&nbsp; &nbsp;</a></div>\
								<time>${time}</time>\
								</div>\
								<h1><a href="single.html">${title}</a></h1>\
								<p>${content}</p>\
								<footer>\
								<a href="javascript:" class="${aclass}" onclick="love(${stra_id})">\
								<i class="${iclass}"></i>\
								<div>${lovenum}</div>\
								<div style="display: none">${stra_id}</div>\
								</a>\
								<a class="btn btn-primary more" href="javascript:" onclick="detail(${stra_id})" >\
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
			else {//没有登录的时候
				axios.get("http://127.0.0.1:3000/gameinfo/gamestra",{params:{type:gametype}}).then((res)=>{
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
					for (var i=0;i<res.data.result.length;i++){
						res.data.result[i].time=new Date(res.data.result[i].time).toLocaleString();
						if (res.data.result[i].picture!=null){
							var img=res.data.result[i].picture.split(',');
							res.data.result[i].picture=img[0];
						}
						else {
							res.data.result[i].picture="img/forum/img10.jpg"
						}
					}
					this.arr=res.data.result.slice((page-1)*8,8*page);
				})
			}

		},
		love(stra_id){//点赞
			if (this.statu==true) {
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
					axios.post("http://127.0.0.1:3000/gameinfo/addlovenum",`stra_id=${stra_id}&love=${love}`).then((res)=>{
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
					axios.post("http://127.0.0.1:3000/gameinfo/dellovenum",`stra_id=${stra_id}&love=${love}`).then((res)=>{
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
        search(){//关键词搜索
            var radio = $("#time").find("input[type=radio]");//获取单选框的值
            var checkbox= $("#time").find("input[name=category]");//获取多选框的值
            var text=$("#text").find("input[type=text]").val();//搜索的关键词
            var time;//搜索的时间范围
            var type=new Array();//搜索的类型
            for(var i=0; i<radio.length; i ++){
                if(radio[i].checked){
                    time=radio[i].value;
                }
            }
            for(var i=0; i<checkbox.length; i ++){
                if(checkbox[i].checked){
                    type=checkbox[i].value;
                }
            }
            var params={text:text,time:time,type:type};
            $.when($.ajax(
                {
                    async: false,//同步
                    url : "http://127.0.0.1:3000/gameinfo/seachstra",
                    data:params,
                    dataType: "JSON",
                    type: "GET",
                    success: function (data) {
                    }
                }
            )).done( (gllist)=> {
                if (gllist.code==true){//搜到了
                    $("#stralist>div:last-child").prevAll().remove();
                    $("div[class=search-result]").html(gllist.msg);
                    var result=gllist.result;
                    for (var key in result){//遍历返回的结果数组
                        var stra_id=result[key].stra_id;//获得当前的攻略id
                        if (this.uid!=null){//如果登录了的查询
                            $.ajax({
                                url: "http://127.0.0.1:3000/gameinfo/isDianzan",
                                type: 'post',
                                data:`stra_id=${stra_id}&uid=${this.uid}`,
                                async: false,
                                dataType: 'json',
                            }).then((res)=>{
                                var code=res.code;//用户是否点赞此条攻略的判断条件
                                var result=res.result;
                                var title=result[0].stra_title;
								var imgurl="img/forum/img10.jpg";
								if (result[0].picture!=null){
									var img=result[0].picture.split(',');
									imgurl=img[0];
								}
                                var content="Donec consequat, arcu at ultrices sodales, quam erat aliquet diam, sit amet interdum libero nunc accumsan nisi.";
                                var time=result[0].time;
                                var lovenum=result[0].love;
                                var aclass="love";//点赞标签的样式
                                var iclass="ion-android-favorite-outline";
                                if (code==true){
                                    aclass="love active";
                                    iclass="ion-android-favorite";
                                }
                                $("#page").before(
                                    `<article class="col-md-12 article-list">\
								<div class="inner">\
								<figure><a href="single.html"><img src="${imgurl}" width="100%" height="100%"></a></figure>\
								<div class="details">\
								<div class="detail">\
								<div class="category"><a href="#">用户名&nbsp; &nbsp;</a></div>\
								<time>${time}</time>\
								</div>\
								<h1><a href="single.html">${title}</a></h1>\
								<p>${content}</p>\
								<footer>\
								<a href="javascript:" class="${aclass}" onclick="love(${stra_id})">\
								<i class="${iclass}"></i>\
								<div>${lovenum}</div>\
								<div style="display: none">${stra_id}</div>\
								</a>\
								<a class="btn btn-primary more" href="javascript:">\
								<div>详细</div>\
								<div><i class="ion-ios-arrow-thin-right"></i></div>\
								</a>\
								</footer></div></div></article>`);
                            })
                        }
                        else {//没登陆的查询
                            $.ajax({
                                url: "http://127.0.0.1:3000/gameinfo/isDianzan",
                                type: 'post',
                                data:`stra_id=${stra_id}&uid=${this.uid}`,
                                async: false,
                                dataType: 'json',
                            }).then((res)=>{
                                var code=res.code;//用户是否点赞此条攻略的判断条件
                                var result=res.result;
                                var title=result[0].stra_title;
								var imgurl="img/forum/img10.jpg";
								if (result[0].picture!=null){
									var img=result[0].picture.split(',');
									imgurl=img[0];
								}
                                var content="Donec consequat, arcu at ultrices sodales, quam erat aliquet diam, sit amet interdum libero nunc accumsan nisi.";
                                var time=result[0].time;
                                var lovenum=result[0].love;
                                var aclass="love";//点赞标签的样式
                                var iclass="ion-android-favorite-outline";
                                $("#page").before(
                                    `<article class="col-md-12 article-list">\
								<div class="inner">\
								<figure><a href="single.html"><img src="${imgurl}" width="100%" height="100%"></a></figure>\
								<div class="details">\
								<div class="detail">\
								<div class="category"><a href="#">用户名&nbsp; &nbsp;</a></div>\
								<time>${time}</time>\
								</div>\
								<h1><a href="single.html">${title}</a></h1>\
								<p>${content}</p>\
								<footer>\
								<a href="javascript:" class="${aclass}" onclick="love(${stra_id})">\
								<i class="${iclass}"></i>\
								<div>${lovenum}</div>\
								<div style="display: none">${stra_id}</div>\
								</a>\
								<a class="btn btn-primary more" href="javascript:">\
								<div>详细</div>\
								<div><i class="ion-ios-arrow-thin-right"></i></div>\
								</a>\
								</footer></div></div></article>`);
                            })
                        }
                    }

                }else {//没搜到
                    $("#stralist>div:last-child").prevAll().remove();
                    $("div[class=search-result]").html(gllist.msg);
                    console.log(this.uid)
                }
            });
        },
		detail(stra_id){//跳转到详情页
			open(`strategy_detail.html?stra_id=${stra_id}`,"blank")
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
		}
	},
	created(){
		window.love=this.love;//自动生成元素的onclick事件
		window.loading=this.loading;
		window.detail=this.detail;
		if (location.search.slice(1,4)=="key"){//首页点击搜索攻略执行
			this.arr="";
			var key=decodeURI(location.search.slice(5));
			axios.post("http://127.0.0.1:3000/gameinfo/keystra",`key=${key}`).then((res)=>{
				if (res.data.code==200){
					$("div[class=search-result]").html(res.data.msg);
					$("#stralist>div:last-child").remove();
					for (var i=0;i<res.data.result.length;i++){
						res.data.result[i].time=new Date(res.data.result[i].time).toLocaleString();
					}
					this.arr=res.data.result;
				}
				else{
					$("#stralist>div:last-child").prevAll().remove();
					$("#stralist>div:last-child").remove();
					$("div[class=search-result]").html(res.data.msg);

				}

			})
		}
		else if(location.search.slice(1,5)=="type"){
			var type=location.search.slice(6);
			if (type==1){//端游
				this.dy()
			}else if (type==2){//手游
				this.sy()
			} else if (type==3){
				this.xs()
			}
			else{
				this.qz()
			}
		}
		else{
			axios.get("http://127.0.0.1:3000/user/isLogin").then((res)=>{
				if (res.data.code==200){//判断是否登录了
					this.statu=true;
					this.uid=res.data.userinfo.uid;//记录当前登录的用户账号
					this.loading("");
				}else {
					this.statu=false;
					this.uid=null;
					this.loading("");
				}
			});
		}

	},
	mounted(){//可以进行dom操作
		//this.loading("");//页面初始加载四条点赞最高的攻略
	},
	update(){

	}
})