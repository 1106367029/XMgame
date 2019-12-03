const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
var router=express.Router();
const fs = require("fs");
//添加路由
//1.管理者登录
router.post('/clogin',(req,res)=>{
    var obj=req.body;
    var $cid=obj.cid;
    var $cpwd=obj.cpwd;
    pool.query('SELECT * FROM controller WHERE cid=? AND cpwd=?',[$cid,$cpwd],(err,result)=>{
        if(err) throw err;
        //判断是否登录成功，根据数组长度
        if(result.length>0){
            req.session.controller=result[0];
            res.send({code:200,msg:'登录成功'});
        }
        else{
            res.send({code:300,msg:'登录失败'});
        }
    });

});

//2.判断管理者是否登录
router.get("/cisLogin",(req,res)=>{
    if(req.session.controller){
        var controller=req.session.controller;
        res.send({code:200,msg:'已登录',cinfo:controller});
    }else{
        res.send({code:300,msg:'没有登录'});
    }
})
//3.以id查找用户
router.post('/searchuser',(req,res)=>{
    var obj=req.body;
    var $uid=obj.uid;
    pool.query('SELECT * FROM users where uid=?', [$uid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200,result});
        } else {
            res.send({code: 300, msg: '此用户不存在'});
        }
    });
});
//4.查询所有的用户
router.get('/alluser',(req,res)=>{
    pool.query('SELECT * FROM users',(err,result)=>{
        if(err) throw err;
        //查询结果发送到浏览器
        res.send({code:200,result});
    });
});
//5.上传新闻资讯
router.post('/insertnew',(req,res)=>{
    //获取post请求的数据
    var obj=req.body;
    var $title=obj.title;
    var $content=obj.content;
    var $img=obj.img;
    var $type=obj.type;
    var $source;
    if (obj.source==null){
        $source="本平台";
    }
    else{
        $source=obj.source;
    }
    var $link=obj.link;
    var $time=new Date();
    console.log(obj);
    var sql="INSERT INTO game_info (title,content,img,time,source,link,type) VALUES (?,?,?,?,?,?,?)";
    pool.query(sql,[$title,$content,$img,$time,$source,$link,$type],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'新闻上传成功'});
        }
        else{
            res.send({code:300,msg:'新闻上传失败'});
        }
    });
});
//6.//根据关键词搜索新闻
router.post("/selnewbykey", (req, res) => {
    var obj = req.body;
    var $keyword= obj.keyword;
    pool.query(`SELECT * from game_info WHERE title LIKE '%${$keyword}%' OR content LIKE '%${$keyword}%'`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300,msg:`没有包含"${$keyword}"的内容`});
        }
    })
});
//7.删除新闻
router.post('/delnew',(req,res)=>{
    var obj=req.body;
    var $ginfo_id=obj.ginfo_id;
    pool.query('delete from game_info where ginfo_id=?',[$ginfo_id],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'删除成功'})
        }
        else{
            res.send({code:300,msg:'删除失败'});
        }
    });
});
//8.修改新闻
router.post('/updatenew',(req,res)=>{
    var obj=req.body;
    var $ginfo_id=obj.ginfo_id;
    var $title=obj.title;
    var $content=obj.content;
    var $time=new Date();
    pool.query('update game_info set title=?,content=?,time=? where ginfo_id=?',[$title,$content,$time,$ginfo_id],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'修改成功'})
        }
        else{
            res.send({code:300,msg:'修改失败'});
        }
    });
});
//9.根据关键词查询动态表（论坛的帖子）
router.post("/seldynbykey", (req, res) => {
    var obj = req.body;
    var $keyword= obj.keyword;
    pool.query(`SELECT * from user_dynamics WHERE content_text LIKE '%${$keyword}%'`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300,msg:`没有包含"${$keyword}"的内容`});
        }
    })

});
//10.根据发布动态的用户id搜索动态表（论坛的帖子）
router.post('/getdynbyuid', (req, res) => {//减少
    var obj = req.body;
    var $uid = obj.uid;
    pool.query("select * from  user_dynamics where uid=?", [$uid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:200,result})
        } else {
            res.send({code:300,msg:`id为:'${$uid}'的用户没有发布动态`});
        }
    });
});
//11.根据帖子id搜索评论
router.post('/getplbydynid', (req, res) => {//减少
    var obj = req.body;
    var $dynid= obj.dynamics_id;//帖子的id
    pool.query("select * from  comments inner join users on comments.uid=users.uid where dynamics_id=?", [$dynid], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:200,result})
        } else {
            res.send({code:300,msg:`id为:'${$dynid}'的帖子没有评论`});
        }
    });
});
//12.根据评论的id删除某条评论
router.post('/delpl',(req,res)=>{
    var obj=req.body;
    var $plid=obj.comment_id;
    pool.query('delete from comments where comment_id=?',[$plid],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'删除评论成功'})
        }
        else{
            res.send({code:300,msg:'删除评论失败'});
        }
    });
});
//13.根据游戏的id查询游戏
router.post('/getgamebyid', (req, res) => {//减少
    var obj = req.body;
    var $game_id= Number(obj.gameid);//帖子的id
    pool.query("select * from  game where game_id=?", [$game_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:200,result})
        } else {
            res.send({code:300,msg:`不存在id为:'${$game_id}'的游戏`});
        }
    });
});
//14.添加攻略
router.post('/insertstra',(req,res)=>{
    //获取post请求的数据
    var obj=req.body;
    obj.time=new Date();
    pool.query("INSERT INTO game_strategy set ?",[obj],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'攻略上传成功'});
        }
        else{
            res.send({code:300,msg:'攻略上传失败'});
        }
    });
});
//15.查询所有的攻略
router.post("/selallstr", (req, res) => {
    pool.query("SELECT * FROM game_strategy", (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300});
        }
    })
});
//16.根据关键词查询攻略，标题，和内容一查
router.post("/selstrbykey", (req, res) => {
    var obj = req.body;
    var $keyword= obj.keyword;
    pool.query(`SELECT * from game_strategy WHERE stra_title LIKE '%${$keyword}%' OR content1 LIKE '%${$keyword}%' OR content2 LIKE '%${$keyword}%' OR content3 LIKE '%${$keyword}%' OR content4 LIKE '%${$keyword}%' OR content5 LIKE '%${$keyword}%'`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300,msg:`没有包含"${$keyword}"的内容`});
        }
    })

});
//17.根据游戏id查询攻略
router.post("/selstrbygameid", (req, res) => {
    var obj = req.body;
    var $game_id = obj.game_id;
    pool.query("SELECT * FROM game_strategy where game_id=? ",[$game_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300});
        }
    })
});
//18.删除攻略
router.post('/delstra',(req,res)=>{
    var obj=req.body;
    var $stra_id=obj.stra_id;
    pool.query('delete from game_strategy where stra_id=?',[$stra_id],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'删除攻略成功'})
        }
        else{
            res.send({code:300,msg:'删除攻略失败'});
        }
    });
});
//19.为game表添加游戏
router.post('/insertgame',(req,res)=>{
    //获取post请求的数据
    var obj=req.body;
    pool.query("INSERT INTO game set ?",[obj],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:`游戏${obj.game_name}上传成功`});
        }
        else{
            res.send({code:300,msg:`游戏${obj.game_name}上传失败`});
        }
    });
});
//20.检索game表,获得某类型游戏的id最大的一个然后+1返回客户端
router.post("/selgamebytype", (req, res) => {
    var obj = req.body;
    var $type = obj.type;
    pool.query("SELECT * FROM game WHERE type=? GROUP BY game_id DESC LIMIT 0,1",[$type], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300,msg:"不存在这个类型的游戏"});
        }
    })
});
//21.根据游戏id查询游戏表
router.post("/selgamebyid", (req, res) => {
    var obj = req.body;
    var $game_id = obj.game_id;
    pool.query("SELECT * FROM game where game_id=? ",[$game_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300,msg:`没有查询到id为：“${$game_id}”的游戏`});
        }
    })
});
//22.删除游戏
router.post('/delgame',(req,res)=>{
    var obj=req.body;
    var $gameid=obj.gameid;
    //删除游戏攻略表有关此游戏的数据
    pool.query('delete from game_strategy where game_id=?',[$gameid],(err,result)=>{
        if(err) throw err;
    });
    //删除此游戏图片的文件夹
    var type=parseInt($gameid/100);
    var url=`public/img/game/${type}/${$gameid}`;
    if( fs.existsSync(url) ) {
        fs.readdirSync(url).forEach(function(file) {
            var curPath = url + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(url);
    }
    pool.query('delete from game where game_id=?',[$gameid],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'删除成功'})
        }
        else{
            res.send({code:300,msg:'删除失败'});
        }
    });
});
//退出登录
router.post('/outlogin', (req, res) => {
    req.session.destroy();
});

//导出路由
module.exports=router;