const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
var router=express.Router();
const fs = require("fs");
//添加路由
//一、用户表
//1.用户信息查询，发布的帖子查询
router.get('/userinfo',(req,res)=>{
	//用户是否为空
	if(!req.session.user){
		res.send({code:401,msg:'用户没有登录'});
		//如果验证失败，阻止往后执行
		return;
	}else{
		var $uid=req.session.user.uid;
		pool.query('SELECT * FROM user_dynamics where uid=?',[$uid],(err,result)=>{
			if(err) throw err;
			if (result.length > 0) {
				res.send({code: 200, result:req.session.user,dynamics:result});
			} else {
				res.send({code: 300, result:req.session.user,msg: '此用户没有发布帖子'});
			}
		});
	}
});
//2.用户注册
router.post('/reg',(req,res)=>{
	//获取post请求的数据
	var obj=req.body;
	var $uname=obj.uname;
	var $upwd=obj.upwd;
	var $email=obj.email;
	var $phone=obj.phone;
	var sql="INSERT INTO users (uname, upwd,email,phone,gender) VALUES (?,?,?,?,0)";
	pool.query(sql,[$uname,$upwd,$email,$phone],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'注册成功'});
		}
		else{
			res.send({code:300,msg:'注册失败'});
		}
	});
});
//2.用户登录
router.post('/login',(req,res)=>{
	var obj=req.body;
	var $uname=obj.uname;
	var $upwd=obj.upwd;
	var user={
		uname:$uname
	}
	pool.query('SELECT * FROM users WHERE uname=? AND upwd=?',[$uname,$upwd],(err,result)=>{
		if(err) throw err;
		//判断是否登录成功，根据数组长度
		if(result.length>0){
			req.session.user=result[0];
			res.send({code:200,msg:'登录成功'});
		}
		else{
			res.send({code:300,msg:'登录失败'});
		}
	});

});
//3.判断用户是否登录
router.get("/isLogin",(req,res,next)=>{
	if(req.session.user){
		var user=req.session.user;
		res.send({code:200,msg:'已登录',userinfo:user});
	}else{
		res.send({code:300,msg:'没有登录'});
	}
})
//4.用户名查询
router.post('/queryUname',(req,res)=>{
	var obj=req.body;
	var $uname=obj.uname;
	pool.query('SELECT * FROM users WHERE uname=?',[$uname],(err,result)=> {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code: 300, msg: '用户名已被注册，请重新输入'});
		} else {
			res.send({code: 200, msg: '用户名可用'});
		}
	})
});
//5.用户信息修改
router.post('/updateuser',(req,res)=>{
	var obj=req.body;
	var $email=obj.email;
	var $phone=obj.phone;
	var $gender;
	if (obj.gender=="男"){
		$gender=1;
	}else{$gender=0}
	var $age=obj.age;
	var $introduce=obj.introduce;
	var $uid=obj.uid;
	//console.log(obj.$gender);
	pool.query('update users set gender=?,email=? ,phone=?,age=?,introduce=? where uid=?',[$gender,$email,$phone,$age,$introduce,$uid],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'修改成功'})
		}
		else{
			res.send({code:300,msg:'修改失败'});
		}
	});
});
//6.删除用户
router.post('/deluser',(req,res)=>{
	var obj=req.body;
	var $uid=obj.uid;
	//1.删除二级评论表有关此用户的数据
	pool.query('delete from second_comments where uid=?',[$uid],(err,result)=>{
		if(err) throw err;
	});
	//2.删除评论表有关此用户的数据
	pool.query('delete from comments where uid=?',[$uid],(err,result)=>{
		if(err) throw err;
	});
	//3.删除关注表有关此用户的数据
	pool.query('delete from attention where uid=? or gzuid=?',[$uid,$uid],(err,result)=>{
		if(err) throw err;
	});
	//4.删除消息表有关此用户的数据
	pool.query('delete from chat where to_id=? or from_id=?',[$uid,$uid],(err,result)=>{
		if(err) throw err;
	});
	//5.查找当前用户发布的帖子的图片，删除文件夹里的图
	pool.query('SELECT picture1,picture2,picture3 from user_dynamics where uid=?',[$uid],(err,result)=>{
		if(err) throw err;
		if(result.length>0){//用户发布了帖子，删除图
			for (var i=0;i<result.length;i++){
				if (result[i].picture1!=null&&result[i].picture1!=""&& result[i].picture1!='undefined'){
					var url=`public/${result[i].picture1}`;
					fs.unlink(url,(err)=>{
						if (err){
							throw err;
						}
					})
				}
				if (result[i].picture2!=null&&result[i].picture2!=""&& result[i].picture2!='undefined'){
					var url=`public/${result[i].picture2}`;
					fs.unlink(url,(err)=>{
						if (err){
							throw err;
						}
					})
				}
				if (result[i].picture3!=null &&result[i].picture3!="" && result[i].picture3!='undefined'){
					var url=`public/${result[i].picture3}`;
					fs.unlink(url,(err)=>{
						if (err){
							throw err;
						}
					})
				}
			}
			//删除论坛表有关此用户的数据
			pool.query('delete from user_dynamics where uid=?',[$uid],(err,result)=>{
				if(err) throw err;
			});
		}
	});


	pool.query('delete from users where uid=?',[$uid],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'删除成功'})
		}
		else{
			res.send({code:300,msg:'删除失败'});
		}
	});
});
//7.用户信息查询无参数
router.get('/detail',(req,res)=>{
	pool.query('SELECT * FROM users limit 4',(err,result)=>{
		if(err) throw err;
		//查询结果发送到浏览器
		res.send(result);
	});
});
//8.根据id关注用户
router.post('/gzuser',(req,res)=>{
	var obj=req.body;
	var $gzuid=obj.uid;
	var $uid=req.session.user.uid;
	if($gzuid==$uid){
		res.send({code:300,msg:'您不可以关注自己'});
		return
	}
	pool.query(' SELECT * from attention WHERE uid=? AND gzuid=? ',[$uid,$gzuid],(err,result)=>{
		if(err) throw err;
		if(result.length>0){//用户已经关注了这个用户
			res.send({code:300,msg:'您已经关注了此用户,不需要重新关注'})
		}
		else{//没有关注
			pool.query('INSERT INTO attention (uid,gzuid) VALUES (?,?)',[$uid,$gzuid],(err,result)=>{
				if(err) throw err;
				if(result.affectedRows>0){
					res.send({code:200,msg:'关注成功'})
				}
				else{
					res.send({code:300,msg:'关注失败'});
				}
			});
		}
	});

});
//9.根据用户id查找粉丝
router.post('/fans',(req,res)=>{
	var obj=req.body;
	var $uid=req.session.user.uid;
	pool.query('SELECT * FROM attention inner join users on attention.uid=users.uid WHERE attention.gzuid=?',[$uid],(err,result)=> {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code: 200,result});
		} else {
			res.send({code: 300, msg: '你还没有粉丝'});
		}
	})
});
//10.查找我的关注
router.post('/myattention',(req,res)=>{
	var obj=req.body;
	var $uid=req.session.user.uid;
	pool.query('SELECT * FROM attention inner join users on attention.gzuid=users.uid WHERE attention.uid=?',[$uid],(err,result)=> {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code: 200,result});
		} else {
			res.send({code: 300, msg: '你还没有关注任何人'});
		}
	})
});
//11.根据用户id查询用户信息
router.post('/userbyid',(req,res)=>{
	var obj=req.body;
	var $uid=obj.uid;
	pool.query('SELECT * FROM users where uid=?',[$uid],(err,result)=>{
		if(err) throw err;
		if (result.length > 0) {
			var user=result;
			pool.query('SELECT * FROM user_dynamics where uid=?',[$uid],(err,result)=>{
				if(err) throw err;
				if (result.length > 0) {
					res.send({code: 200, result:user,dynamics:result});
				} else {
					res.send({code: 300, result:user,msg: '此用户没有发布帖子'});
				}
			});
		}
	});

});



//二、动态表
//1.查询帖子yu用户表连接
router.get('/dynamics',(req,res)=>{
	pool.query('SELECT * FROM user_dynamics inner join users on user_dynamics.uid=users.uid',(err,result)=>{
		if(err) throw err;
		if (result.length > 0) {
			res.send({code: 200, msg: '查询帖子成功',result});
		} else {
			res.send({code: 300, msg: '查询帖子失败'});
		}
	});
});
//2.修改帖子点赞人数
router.post('/lovenum', (req, res) => {
	var obj = req.body;
	var $dynamics_id = obj.dynamics_id;
	var $praise_num = obj.praise_num;
	pool.query('update user_dynamics set praise_num=? where dynamics_id=?', [$praise_num, $dynamics_id], (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send('帖子点赞人数修改成功')
		} else {
			res.send('帖子点赞人数修改失败');
		}
	});
});
//3.根据用户id查看用户是否点赞当前的文章
router.post("/isdianzan", (req, res) => {
	var obj=req.body;
	var $dynamics_id=obj.dynamics_id;//传过来的攻略id
	var $id = obj.uid;//需要查询的用户id
	pool.query('SELECT * FROM user_dynamics where dynamics_id=? and love_users is not null',[$dynamics_id], (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			var arr = result[0].love_users.split(",");
			var is=1;
			for (var key in arr) {
				if (arr[key] == $id) {
					var is=0;
					res.send({code: true,msg:"此用户已经点赞过这条",result:result});
					return;
				}
			}
			if (is==1){
				res.send({code: false,msg:"此用户没有点赞这条",result:result});
			}
		}
		else {
			res.send({code: false,msg:"没有这文章"});
		}
	});
});
//4.攻略修改点赞人数和love_user列
router.post('/addlovenum', (req, res) => {//增加
	var obj = req.body;
	var $dynamics_id = obj.dynamics_id;
	var $praise_num = obj.love;//
	var $uid=req.session.user.uid;
	pool.query("update user_dynamics set praise_num=?,love_users=CONCAT(love_users,?,',') where dynamics_id=?", [$praise_num,$uid, $dynamics_id], (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send({code:true})
		} else {
			res.send({code:false});
		}
	});
});
router.post('/dellovenum', (req, res) => {//减少
	var obj = req.body;
	var $dynamics_id = obj.dynamics_id;
	var $praise_num = obj.love;
	var $uid=req.session.user.uid;
	pool.query(`update user_dynamics set praise_num=?,love_users=TRIM(BOTH ',' FROM replace(concat(',',love_users,','),?,''))  where dynamics_id=?`, [$praise_num,$dynamics_id,$uid], (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send({code:true})
		} else {
			res.send({code:false});
		}
	});
});
//5.根据id查询动态
router.post('/getdynbyid', (req, res) => {//减少
	var obj = req.body;
	var $dynamics_id = obj.dynamics_id;
	pool.query("select * from  user_dynamics inner join users on user_dynamics.uid=users.uid where dynamics_id=?", [$dynamics_id], (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code:200,result})
		} else {
			res.send({code:300,msg:`没有id为:'${$dynamics_id}'的这条动态`});
		}
	});
});
//6.删除动态
router.post('/deletedyn', (req, res) => {
	var obj = req.body;
	var $dynamics_id=obj.dynamics_id;
	pool.query("select * from user_dynamics where dynamics_id=?", [$dynamics_id], (err, result) => {
		if (err) throw err;
		if (result.length> 0) {
			if (result[0].picture1!=null&&result[0].picture1!=""&& result[0].picture1!='undefined'){
				var url=`public/${result[0].picture1}`;
				fs.unlink(url,(err)=>{
					if (err){
						throw err;
					}
				})
			}
			if (result[0].picture2!=null&&result[0].picture2!=""&& result[0].picture2!='undefined'){
				var url=`public/${result[0].picture2}`;
				fs.unlink(url,(err)=>{
					if (err){
						throw err;
					}
				})
			}
			if (result[0].picture3!=null &&result[0].picture3!="" && result[0].picture3!='undefined'){
				var url=`public/${result[0].picture3}`;
				fs.unlink(url,(err)=>{
					if (err){
						throw err;
					}
				})
			}
			pool.query("delete from user_dynamics where dynamics_id=?", [$dynamics_id], (err, result) => {
				if (err) throw err;
				if (result.affectedRows > 0) {
					res.send({code:200,msg:`删除id为：“${$dynamics_id}”用户帖成功`})
				} else {
					res.send({code:300,msg:`删除id为：“${$dynamics_id}”用户帖失败`});
				}
			});

		}
	});

});
//7.根据游戏类型查动态
router.post('/getdynbytype', (req, res) => {//减少
	var obj = req.body;
	var $type = obj.type;
	if ($type==5){//精彩推荐的内容
		pool.query("select * from user_dynamics", (err, result) => {
			if (err) throw err;
			if (result.length > 0) {
				res.send({code:200,result})
			} else {
				res.send({code:300});
			}
		});
	}
	else{//分类的
		pool.query("select * from user_dynamics where type=?", [$type], (err, result) => {
			if (err) throw err;
			if (result.length > 0) {
				res.send({code:200,result})
			} else {
				res.send({code:300});
			}
		});
	}

});
//8.发表一级评论
router.post('/comment',(req,res)=>{
	var obj=req.body;
	var $dynamics_id=obj.dynamics_id;
	var $content=obj.content;
	var $uid=obj.uid;
	var $time=new Date();
	var sql="INSERT INTO comments (dynamics_id,content,time,uid) VALUES (?,?,?,?)";
	pool.query(sql,[$dynamics_id,$content,$time,$uid],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'评论成功'});
		}
		else{
			res.send({code:300,msg:'评论失败'});
		}
	});

});
//9.发布动态
router.post('/insertdyn',(req,res)=>{
    var obj=req.body;
    var $uid=obj.uid;
    var $content_text=obj.content_text;
    var $picture1=obj.picture1.replace(/public\//ig,"");
	var $picture2=obj.picture2.replace(/public\//ig,"");
	var $picture3=obj.picture3.replace(/public\//ig,"");
    var $creation_time=new Date();
    var $type=obj.type;
    var sql="INSERT INTO user_dynamics (uid,content_text,picture1,picture2,picture3,creation_time,type,comment_num) VALUES (?,?,?,?,?,?,?,0)";
    pool.query(sql,[$uid,$content_text,$picture1,$picture2,$picture3,$creation_time,$type],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'发布动态成功'});
        }
        else{
            res.send({code:300,msg:'发布动态失败'});
        }
    });

});
//10.根据一级评论的id查询二级评论列表
router.post('/secondcbyid', (req, res) => {//减少
	var obj = req.body;
	var $comment_id = obj.comment_id;
	pool.query("SELECT * FROM second_comments inner join users on second_comments.uid=users.uid where comment_id=?", [$comment_id], (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code:200,result})
		} else {
			res.send({code:300,msg:`此评论无二级评论`});
		}
	});
});
//11.根据以及评论id发布二级评论内容
router.post('/scomment',(req,res)=>{
	var obj=req.body;
	var $comment_id = obj.comment_id;
	var $content=obj.content;
	var $uid=obj.uid;
	var $time=new Date();
	var sql="INSERT INTO second_comments (content,time,uid,comment_id) VALUES (?,?,?,?)";
	pool.query(sql,[$content,$time,$uid,$comment_id],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'评论成功'});
		}
		else{
			res.send({code:300,msg:'评论失败'});
		}
	});

});


//图片上传
router.post('/upimg',(req,res)=>{
	var imgData=req.body.img;
	var dir=req.body.dir;
	var imagename=req.body.imgname;
	var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
	var dataBuffer = new Buffer(base64Data, 'base64');
	var imgurl=`${dir}/${imagename}.jpg`;
	fs.exists(dir,(exists)=>{
		if(!exists){//不存在文件夹就创建文件夹
			fs.mkdir(dir,(err)=>{
				if (err){
					throw err;
				}
			})
		}
	});
	fs.writeFile(imgurl, dataBuffer, function(err) {
		if(err){
			res.send(err);
		}else{
			res.send({code:200,imgurl,msg:"保存成功！"});
		}
	});
});
//用户换头像
router.post('/changetx', (req, res) => {//减少
	var obj = req.body;
	var $picture = obj.picture.replace(/public\//ig,"");
	var $uid=req.session.user.uid;
	pool.query(`update users set picture=? where uid=?`, [$picture,$uid], (err, result) => {
		if (err) throw err;
		if (result.affectedRows > 0) {
			res.send({code:200,msg:"上传头像成功！"})
		} else {
			res.send({code:300,msg:"上传头像失败！"});
		}
	});
});

//1.给信息表添加信息，发送信息
router.post('/sendmsg',(req,res)=>{
	//获取post请求的数据
	var obj=req.body;
	var $from_id=obj.from_id;//发信人id
	var $to_id=obj.to_id;//收信人id
	var $content=obj.content;
	pool.query("delete from chat where from_id=? and to_id=? and content=?",[$from_id,$to_id,$content],(err,result)=>{
		if(err) throw err;
	});
	var sql="INSERT INTO chat (from_id,to_id,content) VALUES (?,?,?)";
	pool.query(sql,[$from_id,$to_id,$content],(err,result)=>{
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({code:200,msg:'发生消息成功'});
		}
		else{
			res.send({code:300,msg:'发送消息失败'});
		}
	});
});
//2.查看自己的聊天邀请（自己是被邀请方）
router.post('/mychat', (req, res) => {//减少
	var obj = req.body;
	var $to_id =req.session.user.uid;
	pool.query("SELECT * FROM chat inner join users on chat.from_id=users.uid where to_id=? and content='0'", [$to_id], (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code:200,result,msg:"你的聊天邀请在result里"})
		} else {
			res.send({code:300,msg:`您还没有聊天邀请`});
		}
	});
});
//3.同意后删除此条信息记录
router.post('/delmsg',(req,res)=>{
	//获取post请求的数据
	var obj=req.body;
	var $chat_id=obj.chat_id;
	pool.query("delete from chat where chat_id=?",[$chat_id],(err,result)=>{
		if(err) throw err;
		if (result.affectedRows > 0) {
			res.send({code:200})
		} else {
			res.send({code:300});
		}
	});
});
//查看自己的私信
router.post('/mysx', (req, res) => {//减少
	var obj = req.body;
	var $to_id =req.session.user.uid;
	pool.query("SELECT * FROM chat inner join users on chat.from_id=users.uid where to_id=? and content!='0'", [$to_id], (err, result) => {
		if (err) throw err;
		if (result.length > 0) {
			res.send({code:200,result,msg:"你的私信在result里"})
		} else {
			res.send({code:300,msg:`您还没有私信`});
		}
	});
});
//用户退出登录
router.post('/outlogin', (req, res) => {
	req.session.destroy();
});


//导出路由
module.exports=router;
