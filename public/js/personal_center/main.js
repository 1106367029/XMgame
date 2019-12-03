new Vue({
    el:".lmlblog-member-main",
    data:{
        uname:"",uid:"",gender:"",age:"",phone:"",email:"",introduce:"",
        dynamics:"",//用户发布的帖子
        formData:new FormData(),
        imgs: {},
        imgLen:0,
        allpage:1,//记录帖子当前的页面是第几页，默认为1
        imgBase64:[],//上传帖子时候的图片数组
        tzcontent:"",//上传帖子时的内容
        TxBase64:[],//我的头像地址
        imgurl:"",
        fans:"",//我的粉丝数组
        myattention:"",//我的关注
        talklist:"",//聊天邀请的list
        sxlist:"",//私信的list
        gznum:0,//关注的人数
        fannum:0,//粉丝人数
    },
    methods:{
        getuser(){//首次加载个人中心
            axios.get("http://127.0.0.1:3000/user/userinfo").then((res)=>{
                var result=res.data;
                if (result.code==401){//如果用户没有登录
                    if(confirm("请先登录")){
                        location.replace("login.html")
                    }else {
                        location.replace("index.html")
                    }
                }
                else{//用户登录了
                    var user=result.result;
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
                        $(".lmlblog-post-list").prepend(`<h1 style="color: red;font-size: 30px;margin:20px 20px 20px 0">你还没有发布动态</h1>`)
                    }
                }
            })
        },
        input(){//将input输入框变成可写状态
            var input=$("#userinfo").find("[readonly]");
            for (var i=1;i<input.length;i++){
                $(input[i]).css("border","1px solid black").removeAttr("readonly");
            }
        },
        modify(){//修改个人信息
            axios.post("http://127.0.0.1:3000/user/updateuser",`uid=${this.uid}&gender=${this.gender}&age=${this.age}&phone=${this.phone}&email=${this.email}&introduce=${this.introduce}`).then((res)=>{
                if(res.data.code==200){
                    var input=$("#userinfo").find("input");
                    for (var i=1;i<input.length;i++){
                        $(input[i]).css("border","0px").attr("readonly","true");
                    }
                    $("#userinfo").find("textarea").css("border","0px").attr("readonly","true");
                }
            })
        },
        deletedyn(dynamics_id){
            if (confirm("确定要删除这条帖子？")){
                axios.post("http://127.0.0.1:3000/user/deletedyn",`dynamics_id=${dynamics_id}`).then((res)=>{
                    if(res.data.code==200){
                        //删除成功
                        alert(res.data.msg)
                        location.reload(true);//从服务器端获取新数据刷新
                    }
                    else {
                        alert("删除失败，请重试")
                    }
                })
            }


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
        //获取图片base64实现预览
        getImgBase(){
            /**得到FileList的第一个元素，也就是上传的图片**/
            if (this.imgBase64.length<3){//这里只能上传三种图片
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
                alert("只能上传三张图片")
            }
        },
        //删除图片
        delImg(index){
            this.imgBase64.splice(index,1);
        },
        getimgurl(){//获得上传帖子的图片的地址
            var Pic = this.imgBase64;
            var imgurls=new Array();
            var time=new Date().toLocaleTimeString().replace(/:/ig,"-");
            for (var key in Pic){
                Pic[key]= Pic[key].toString().replace(/^data:image\/(png|jpg);base64,/,"");
                console.log(Pic[key]);
                // 图片以base64的方式传给后台
                var imgname="tz"+this.uid+time+key;
                var dir=`public/img/personal_center/${this.uid}`;//判断这个用户的目录是否存在
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
            return imgurls;
        },
        inserttz(){//发布动态
            var picture=this.getimgurl();//上传帖子的图片地址
            var content_text=this.tzcontent;
            var type=Number($("#tztype>option:selected").val());
            if (content_text==""&&picture==""){
                alert("发布的动态不可以为空！")
            }else if (type!=5){
                axios.post("http://127.0.0.1:3000/user/insertdyn",`uid=${this.uid}&picture1=${picture[0]}&picture2=${picture[1]}&picture3=${picture[2]}&content_text=${content_text}&type=${type}`).then((res)=>{
                    if(res.data.code==200){
                        alert(res.data.msg);
                        this.imgBase64=[];
                        this.tzcontent="";
                        //location.reload(true);//强制刷新，从服务器获取信息
                    }
                    else {
                        alert(res.data.msg)
                    }
                })
            }
            else {
                alert("请选择要发布的动态的类型！")
            }

         },
        getTx(){
            var _this = this;
            var event = event || window.event;
            var file = event.target.files[0];
            /**创建一个FileReader实例，用来读取文件**/
            var reader = new FileReader();
            var result=new Array();
            //转base64
            /**成功读取之后将图片显示出来**/
            reader.onload = function(e) {
                _this.TxBase64[0]=e.target.result;
            }
            if(file.size/1024/1025/2>2){
                alert("不能上传超过2MB的图片");
            }
            else{
                reader.readAsDataURL(file);
            }
            var Pic = this.TxBase64;
            for (var key in Pic) {
                Pic[key] = Pic[key].toString().replace(/^data:image\/(png|jpg);base64,/, "");
                // 图片以base64的方式传给后台
                var imgname = "tx" + this.uid;
                var dir = `public/img/personal_center/${this.uid}`;//判断这个用户的目录是否存在
                $.ajax({
                    type: 'POST',
                    url: 'http://127.0.0.1:3000/user/upimg',
                    data: {img: Pic[key], imgname, dir},
                    dataType: 'json',
                    async: false,
                    success: function (res) {
                        if (res.code == 200) {
                            alert(res.msg);
                            result[result.length]=res.imgurl;
                        } else {
                            console.log(res);
                        }
                    }
                })
            }
            return result;
        },
        getTximg() {
            var url=this.getTx();
            axios.post("http://127.0.0.1:3000/user/changetx",`picture=${url[0]}`).then((res)=>{
                if(res.data.code==200){
                    alert(res.data.msg);
                }
                else {
                    alert(res.data.msg)
                }
            })
        },
        pcuser(uid){//用户详细界面跳转
            open(`pc_user.html?uid=${uid}`)
        },
        agreetalk(chatid,from,to,e){//同意聊天
            axios.post("http://127.0.0.1:3000/user/delmsg",`chat_id=${chatid}`).then((res)=>{//同意后删除此条邀请信息
                if(res.data.code==200){
                    $(e.target).parent().remove();
                    open(`http://localhost:3000/service.html?cid=${from}&sid=${to}`,"_blank")
                }
                else {
                    alert("进入聊天失败")
                }
            })
        },
        delsx(chatid,e){//删除私信
            if (confirm("你确定要删除此条私信吗")){
                axios.post("http://127.0.0.1:3000/user/delmsg",`chat_id=${chatid}`).then((res)=>{//删除私信
                    if(res.data.code==200){
                        $(e.target).parent().remove();
                    }
                    else {
                        alert("删除私信失败")
                    }
                })
            }
        },
        detail(dynamics_id){//查看帖子详情
            open(`forum_detail.html?dynamics_id=${dynamics_id}`,"blank")
        },
    },
    created(){
        this.getuser();
        axios.get("http://127.0.0.1:3000/user/isLogin").then((res)=>{
            if (res.data.code==200){//判断是否登录了
                axios.post("http://127.0.0.1:3000/user/fans").then((res)=>{//我的粉丝
                    if(res.data.code==200){
                        this.fans=res.data.result;
                        this.fannum=res.data.result.length;
                    }
                    else {
                        //alert(res.data.msg)
                        this.fannum=0;
                        $("#fans").siblings().remove();
                        $("#fans").after(`<h5 style="color: red">${res.data.msg}</h5>`)
                    }
                })
                axios.post("http://127.0.0.1:3000/user/myattention").then((res)=>{//我关注的人
                    if(res.data.code==200){
                        this.myattention=res.data.result;
                        this.gznum=res.data.result.length;
                    }
                    else {
                        this.gznum=0;
                        $("#gz").siblings().remove();
                        $("#gz").after(`<h5 style="color: red">${res.data.msg}</h5>`)
                    }
                })
                axios.post("http://127.0.0.1:3000/user/mychat").then((res)=>{
                    //获取自己的聊天邀请
                    if(res.data.code==200){
                        $("#chat").css("display","block");
                        this.talklist=res.data.result;
                    }
                    else {
                        //alert(res.data.msg)
                        $("#chat").css("display","none");
                    }
                })
                axios.post("http://127.0.0.1:3000/user/mysx").then((res)=>{
                    //获取自己私信列表
                    if(res.data.code==200){
                        $("#sx").css("display","block");
                        this.sxlist=res.data.result;
                    }
                    else {
                        //alert(res.data.msg)
                        $("#sx").css("display","none");
                    }
                })
            }
        });



    },
    mounted(){
    },
    update(){

    }
})
function outlogin(){//退出登录
    if (confirm("确定退出当前登录账号吗？")){
        axios.post("http://127.0.0.1:3000/user/outlogin").then((res)=>{//销毁session
        })
        location.replace(`index.html`);
    }
}