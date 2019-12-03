//眼睛 密码部分
$(".mima").focus(function() {
    $(".music-lgin-left").addClass("left-dh").removeClass("rmleft-dh");
    $(".music-lgin-right").addClass("right-dh").removeClass("right-rmdh");
    $(".music-hand").addClass("no");
}).blur(function() {
    $(".music-lgin-left").removeClass("left-dh").addClass("rmleft-dh");
    $(".music-lgin-right").removeClass("right-dh").addClass("right-rmdh");
    $(".music-hand").removeClass("no");

})
//点击小人出来
$(".inputname").focus(function() {
    $(".music-lgin-all").addClass("block");
    $(".music-news").addClass("no")
})
//点击小人消失

//          $(".music-qd").focus(function(){
//          	$(".music-lgin-all").removeClass("block")
//          })



new Vue({
    el:"#app",
    data:{
        show:true,
        //登录
        uname:"",
        upwd:"",
        //注册
        reguname:"", regupwd:"", cregupwd:"",email:"",phone:"",

    },
    methods:{
        login(){//登录
            axios.post("http://127.0.0.1:3000/user/login",`uname=${this.uname}&upwd=${this.upwd}`).then(function (res) {
                if (res.data.code==200){
                    location.replace("index.html")
                }
            })
        },
        regs(){//注册
            axios.post("http://127.0.0.1:3000/user/reg",`uname=${this.reguname}&upwd=${this.regupwd}&email=${this.email}&phone=${this.phone}`)
                .then((res)=> {//在then里要获得data的数据要用箭头函数才可以用this获取
                if (res.data.code==200){
                    alert("注册成功,前往登录");
                    this.show=true;
                }else {
                    console.log("注册失败，请重新注册")
                    this.show=false;
                }
            })
        },
        nullcheck(elem,txt,btn,type){//空值验证
            if(elem==""){
                $(`#${txt}`).html(`${type}不可以为空!`);
                $(`#${btn}`).attr("disabled",true);//设置按钮不可以点击
                //alert(1)
            }
            else{
                $(`#${txt}`).html("&nbsp;");
                $(`#${btn}`).attr("disabled",false);
            }
        },
        pwdcheck(elem,txt,btn,reg,tips,i){//密码验证
            if (elem.length>i){
                if (!reg.test(elem)){
                    $(`#${txt}`).html(tips);
                    $(`#${btn}`).attr("disabled",true);
                }
                else{
                    $(`#${txt}`).html("&nbsp;");
                    $(`#${btn}`).attr("disabled",false);
                }
            }
            else {
                $(`#${btn}`).attr("disabled",true);
            }
        },
        unblur(){//用户名验证
            this.nullcheck(this.uname,"nametips","userlogin","用户名");
        },
        upblur(){//密码验证
            this.nullcheck(this.upwd,"pwdtips","userlogin","密码");
        },
        reg(){//注册跳转
            this.show=false;
        },

        /****注册开始****/
        regunblur(){//用户名空值验证
            this.nullcheck(this.reguname,"tipsname","regbtn","用户名");
            axios.post("http://127.0.0.1:3000/user/queryUname",`uname=${this.reguname}`).then((res)=> {
                if (res.data.code==200){
                    $("#tipsname").html(res.data.msg).css("color","green");
                    $("#regbtn").attr("disabled",false);
                }
                else {
                    $("#tipsname").html(res.data.msg).css("color","red");
                    $("#regbtn").attr("disabled",true);
                }
            })
        },
        regupwdblur(){//密码验证
            this.nullcheck(this.regupwd,"tipspwd","regbtn","密码");
            var reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
            var tips="密码至少8-16个字符，至少1个大写字母，1个小写字母和1个数字";
            this.pwdcheck(this.regupwd,"tipspwd","regbtn",reg,tips,8);
        },
        cregupwdblur(){//密码确认空值验证
            this.nullcheck(this.cregupwd,"tipscpwd","regbtn","密码");
            if (this.cregupwd!=this.regupwd){
                $("#tipscpwd").html("前后密码不一致");
                $("#regbtn").attr("disabled",true);
            }
            else {
                $("#regbtn").attr("disabled",false);
                $("#tipscpwd").html("&nbsp;");
            }
        },
        emailblur(){//邮箱空值验证
            this.nullcheck(this.email,"tipsemail","regbtn","邮箱");
            var reg=/^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
            var tips="邮箱格式不正确";
            this.pwdcheck(this.email,"tipsemail","regbtn",reg,tips,0);
        },
        phoneblur(){//电话号码空值验证
            this.nullcheck(this.phone,"tipsphone","regbtn","号码");
            var reg=/^1[3456789]\d{9}$/;
            var tips="手机号码格式不正确";
            this.pwdcheck(this.phone,"tipsphone","regbtn",reg,tips,0);
        }
        /***注册结束***/
    },
    watch:{
        upwd(){//密码验证
            var reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
            var tips="密码至少8-16个字符，至少1个大写字母，1个小写字母和1个数字";
            this.pwdcheck(this.upwd,"pwdtips","userlogin",reg,tips,7);
        }
    }
})

