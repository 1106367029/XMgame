//使用express构建web服务器
const express = require('express');
var cookieParser = require('cookie-parser');
const session = require("express-session");
const bodyParser = require('body-parser');
const cors=require("cors");

/*引入路由模块*/
var user=require("./routes/user");//用户路由
var gameinfo=require("./routes/gameinfo");//游戏路由
var controller=require("./routes/controller");//后台管理者路由
var app = express();


//聊天start
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/client', function (req, res) {
  res.sendFile(__dirname + '/client.html');
})
app.get('/service', function (req, res) {
  res.sendFile(__dirname + '/service.html');
})

// socket连接对象，键名：cid****_sid***、sid****_cid****（前面为发送方，后面为接收方）
let localSockets = {}

class Chat {
  constructor(socket, chatInfo) {
    this.socket = socket
    this.chatInfo = chatInfo
  }

  isCustomerSender() {
    if (this.chatInfo.customer && this.chatInfo.customer.isSender === true) {
      return true
    } else {
      return false
    }
  }

  getSocketKeyValue() {
    // 客户是发送消息方，客服是接收消息方
    if (this.isCustomerSender()) {
      return {
        key: `cid${this.chatInfo.customer.id}_sid${this.chatInfo.service.id}`,
        val: this.socket
      }
    } else {
      return {
        key: `sid${this.chatInfo.service.id}_cid${this.chatInfo.customer.id}`,
        val: this.socket
      }
    }
  }
}

class Message {
  constructor(req){
    this.req = req
    this.userInfo = this.req.userInfo || {}
    this.msg = this.req.msg || ''
  }
  getSenderKey(){
    if(this.userInfo.customer.isSender){
      return `cid${this.userInfo.customer.id}`
    } else {
      return `sid${this.userInfo.service.id}`
    }
  }
  getReceiverKey(){
    if(this.userInfo.customer.isSender){
      return `sid${this.userInfo.service.id}`
    } else {
      return `cid${this.userInfo.customer.id}`
    }
  }
  send(){
    if(localSockets[`${this.getSenderKey()}_${this.getReceiverKey()}`]){
      localSockets[`${this.getSenderKey()}_${this.getReceiverKey()}`].emit('callback private message', {
        msg: this.msg,
        self: true
      })
    }
    if(localSockets[`${this.getReceiverKey()}_${this.getSenderKey()}`]){
      localSockets[`${this.getReceiverKey()}_${this.getSenderKey()}`].emit('callback private message', {
        msg: this.msg,
        self: false
      })
    }
  }
}

io.on('connect', function (socket) {
  socket.on('new chat', function (chatInfo) {
    let newChatObj = new Chat(socket, chatInfo)
    let newSocket = newChatObj.getSocketKeyValue()
    // 若重复登录，断开原连接
    if(newSocket.key in localSockets){
      localSockets[newSocket.key].disconnect(true)
    }
    // 设置新连接
    localSockets[newSocket.key] = newSocket.val
  })
  socket.on('send private message', function(req){
    let msgObj = new Message(req)
    console.log('send private message', req);
    msgObj.send()
  })
})


app.set('port', process.env.PORT || 3000);


var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
});

//聊天end


app.use(cors({
  origin:'http://localhost:3000',
  credentials:true
}))
//var server = app.listen(3000);
//使用body-parser中间件
app.use(bodyParser.json({limit: '5mb'}));//可解析的json大小设置为5MB
app.use(bodyParser.urlencoded({limit: '5mb',extended:false}));

//托管静态资源到public目录下
app.use(express.static('public'));
app.use(cookieParser('sessiontest'));
app.use(session({
  secret:'sessiontest',
  cookie:{maxAge:60*1000*30},//过期时间ms
  resave:false,
  saveUninitialized:true
}));//将服务器的session，放在req.session中

/*使用路由器来管理路由*/
app.use("/user",user);
app.use("/gameinfo",gameinfo);
app.use("/controller",controller);



