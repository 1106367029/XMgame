const express = require('express');
//引入连接池模块
const pool = require('../pool.js');
var router = express.Router();
const fs = require("fs");
//添加路由

function simpleGet(url, sql) {//简单的get表查询，无参
    router.get(url, (req, res) => {
        pool.query(sql, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send({code: 200, result});
            } else {
                res.send({code: 300});
            }
        })
    });
}

//查询游戏信息
simpleGet("/info", "SELECT * FROM game")

//查游戏资讯表
simpleGet("/gameinfos", "SELECT * FROM game_info");


//查游戏攻略表
router.get("/gamestra", (req, res) => {
    var obj=req.query;
    var type=obj.type;
    if (type==""||type==undefined){//空
        pool.query("SELECT * FROM game_strategy GROUP BY love DESC",(err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send({code: 200, result});
            } else {
                res.send({code: 300,msg:"没有查到攻略（未登录或者type为空）"});
            }
        })
    }else {
        pool.query(`SELECT * FROM game_strategy  where game_id like '${type}%' GROUP BY love DESC`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.send({code: 200, result});
            } else {
                res.send({code: 300,msg:"没有查到攻略（登录）"});
            }
        })
    }
});
//热门攻略
simpleGet("/hotgamestra", "SELECT * FROM game_strategy limit 8")

//攻略修改点赞人数和love_user列
function lovenum(url,sql){
    router.post(url, (req, res) => {
        var obj = req.body;
        var $stra_id = obj.stra_id;
        var $stra_love = obj.love;
        var $uid=req.session.user.uid;
        pool.query(sql, [$stra_love,$uid, $stra_id], (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
                res.send({code:true})
            } else {
                res.send({code:false});
            }
        });
    });
}
//点赞
lovenum("/addlovenum","update game_strategy set love=?,love_users=CONCAT(love_users,?,',') where stra_id=?");
//取消点赞
lovenum("/dellovenum","update game_strategy set love=?,love_users=trim(both ',' from replace(concat(',',love_users,','),?,',')) where stra_id=?");

//根据用户id查看用户是否点赞当前的文章
router.post('/isDianzan', (req, res) => {
    var obj=req.body;
    var $stra_id=obj.stra_id;//传过来的攻略id
    var $id = obj.uid;//需要查询的用户id
    $id=$id.replace(/\b(0+)/gi,"");
    pool.query('SELECT * FROM game_strategy where stra_id=? and love_users is not null',[$stra_id], (err, result) => {
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

//攻略页面搜索，查游戏攻略表,（依据内容、标题关键词，时间、游戏类型）
router.get("/seachstra",(req,res)=> {
    var obj = req.query;
    var time = obj.time;
    var type = Number(obj.type);//搜索的游戏类型
    var keyword = obj.text;//搜索的关键词
    if (time == "yesterday") {
        time=new Date(new Date().setDate((new Date().getDate() - 1))).toLocaleDateString();//获取当前时间并减去1天时间，取年月日
    } else if (time == "lastweek") {
        time=new Date(new Date().setDate((new Date().getDate() - 7))).toLocaleDateString();//减去7天

    } else if (time == "lastmonth") {
        time=new Date(new Date().setMonth((new Date().getMonth()-1))).toLocaleDateString();//减去一个月

    } else {
        time=2;
    }
    //
    pool.query(`SELECT * FROM game_strategy where stra_title like '%${keyword}%' and time like '${time}%' and game_id like '${type}%' `, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:true,msg:`找到${result.length}条关于${keyword}的攻略`,result})
        } else {
            res.send({code:false,msg:`没有关于${keyword}的攻略`,result:""});
        }
    });
});

//根据攻略id查询攻略
router.post("/selstrbyid", (req, res) => {
    var obj = req.body;
    var $stra_id = obj.stra_id;
    pool.query("SELECT * FROM game_strategy where stra_id=? ",[$stra_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300});
        }
    })
});
//根据关键词查询攻略
router.post("/keystra",(req,res)=> {
    var obj = req.body;
    var keyword = obj.key;//搜索的关键词
    pool.query(`SELECT * FROM game_strategy where stra_title like '%${keyword}%'`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:200,msg:`找到${result.length}条关于${keyword}的攻略`,result})
        } else {
            res.send({code:300,msg:`没有关于${keyword}的攻略`,result:""});
        }
    });
});


//1.获取新闻表的内容
simpleGet("/news", "SELECT * FROM game_info");
//2.根据id查询新闻资讯表
router.post("/selnewbyid", (req, res) => {
    var obj = req.body;
    var $ginfo_id = obj.ginfo_id;
    pool.query("SELECT * FROM game_info where ginfo_id=? ",[$ginfo_id], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code: 200, result});
        } else {
            res.send({code: 300});
        }
    })

});
//千楼书活动添加评论
router.post('/insbook',(req,res)=>{
    var obj=req.body;
    var $content=obj.content;
    var $uid=obj.uid;
    var $time=new Date();
    pool.query("SELECT * FROM book", (err, result) => {
        if (err) throw err;
        if (result.length > 0 && result.length<=1000) {//楼数大于1000不可再评论
            var sql="INSERT INTO book (uid,content,time) VALUES (?,?,?)";
            pool.query(sql,[$uid,$content,$time],(err,result)=>{
                if(err) throw err;
                if(result.affectedRows>0){
                    res.send({code:200,msg:'评论成功'});
                }
                else{
                    res.send({code:300,msg:'评论失败'});
                }
            });
        } else {
            res.send({code: 300,msg:"楼层已满1000，活动结束，不可再添加！"});
        }
    })


});
//查找千楼书的评论
simpleGet("/book", "SELECT * FROM book inner join users on book.uid=users.uid GROUP BY book.time")
//上传小说文件至数据库
router.post('/upbooktxt',(req,res)=>{
    var obj=req.body;
    var $content=obj.content;
    var $uid=req.session.user.uid;
    var $url=`public/booktxt/${$uid}.txt`;
    var $time=new Date();
    fs.writeFile($url, $content, function(err) {
        if (err) {
            res.send(err);
        }
        else {
            pool.query("SELECT * FROM booktxt where uid=?", [$uid], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {//booktxt表存在这个用户的的信息，则不需要再插入
                    res.send({code: 200, msg: '上传成功'});
                } else {
                    var sql = "INSERT INTO booktxt (uid,url,time) VALUES (?,?,?)";
                    pool.query(sql, [$uid, $url, $time], (err, result) => {
                        if (err) throw err;
                        if (result.affectedRows > 0) {
                            res.send({code: 200, msg: '上传成功'});
                        } else {
                            res.send({code: 300, msg: '上传失败'});
                        }
                    })
                }
            })
        }
    })
});
//查询booktxt表
simpleGet("/booktxt", "SELECT * FROM booktxt inner join users on booktxt.uid=users.uid GROUP BY booktxt.time")
//读取txt文件返回数据
router.post('/txt',(req,res)=>{
    var obj=req.body;
    var $url=obj.url;
   fs.readFile($url,(err,data)=>{
       if (err) throw err;
       res.send({code: 200, result:data.toString()});
   })
});
//根据txtid删除booktxt表内容
router.post('/delbooktxt',(req,res)=>{
    var obj=req.body;
    var $txtid=obj.txtid;
    pool.query('delete from booktxt where txtid=?',[$txtid],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'删除成功'})
        }
        else{
            res.send({code:300,msg:'删除失败'});
        }
    });
});
//根据b_id删除book表内容
router.post('/delbook',(req,res)=>{
    var obj=req.body;
    var $b_id=obj.b_id;
    pool.query('delete from book where b_id=?',[$b_id],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:200,msg:'删除成功'})
        }
        else{
            res.send({code:300,msg:'删除失败'});
        }
    });
});
//根据关键词查询book
router.post("/keybook",(req,res)=> {
    var obj = req.body;
    var keyword = obj.key;//搜索的关键词
    pool.query(`SELECT * FROM book where content like '%${keyword}%'`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:200,msg:`找到${result.length}层关于${keyword}的楼层`,result})
        } else {
            res.send({code:300,msg:`没有关于${keyword}的内容的楼层`,result:""});
        }
    });
});
router.post("/idbooktxt",(req,res)=> {
    var obj = req.body;
    var txtid = obj.txtid;//搜索的关键词
    pool.query(`SELECT * FROM booktxt where txtid=${txtid}`, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({code:200,result})
        } else {
            res.send({code:300,msg:`该用户没有上传书籍`,result:""});
        }
    });
});
//导出路由
module.exports = router;