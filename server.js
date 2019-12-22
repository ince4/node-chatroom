const express = require('express');
const server = express();
const http = require('http').Server(server);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);


http.listen(8080);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:false}));
//extended: false：表示使用系统模块querystring来处理，也是官方推荐的
//extended: true：表示使用第三方模块qs来处理

server.use(express.static('node_modules'));
server.use(express.static('public'));//静态资源文件目录

server.get('/',function(req,res){
    res.sendFile(__dirname+'/public/views/index.html');
    // res.sendFile(__dirname+'/public/views/chatroom.html');
})

//登陆部分
  //用户数据
  var users = {
    "user1":"123",
    "user2":"123"
  };

  var onlineUsers = [];

  onlineUsers.elem = function(socketId,targetKey,newValue){
    let targetItem = this.find(x => x.id === socketId);
    if (arguments.length === 1){
      return targetItem;
    }
    else if (arguments.length === 2){
      return targetItem[targetKey];
    }  
    else if (arguments.length === 3){
      targetItem[targetKey] = newValue;
    }
  }

  var reqUserName;
  server.post('/reg',function(req,res){
      //console.log(req.body);{ act: 'login', user: 'aaa',pass: 'bbb' }
      var username=req.body.user;
      var pass=req.body.pass;
    if(username && pass){
        if(users[username]){
            res.send({ok:false,msg:'此用户已存在'});
          }else{
            users[username]=pass;
            res.send({ok:true,msg:'注册成功'});
          }
        }
  })

  server.post('/login',function(req,res){
    io.on("onlineUsers",function(onlineUsersStatus){
      onlineUsers = onlineUsersStatus;
    })

    var username=req.body.user;
    var pass=req.body.pass;

    if(username && pass){
      //用户名不存在
      if(onlineUsers.find(x => x.username == username) instanceof Object){
        res.send({ok:false,hint:0,msg:"该用户当前在线"});
      }
      else if(users[username]==null){
        res.send({ok:false,hint:0,msg:"此用户不存在"});
      }
      else{
        if(users[username]!=pass){
          res.send({ok:false,hint:-1,msg:"密码错误"});
        }
        else{
          res.send({ok:true,msg:"登陆成功"});
          reqUserName = username;
          //→io.on('connection')部分
        }
      }
    }
  });

  //login get方法
  /*server.get('/login',function(req,res){
    console.log(req.query);//{ act: 'login', user: 'aaa', pass: 'bbb' }
    var user=req.query.user;
    var pass=req.query.pass;
    if(users[user]==null){
      res.send({ok:false,msg:"此用户不存在"});
    }else{
      if(users[user]!=pass){
        res.send({ok:false,msg:"密码错误"});
      }else{
        res.send({ok:true,msg:"登陆成功"});
      }
    }
  });*/

  // register get方法
  /*server.get('/reg',function(req,res){
    console.log(req.query);
    var user=req.query.user;
    var pass=req.query.pass;
    if(users[user]){
      res.send({ok:false,msg:'此用户已存在'});
    }else{
      users[user]=pass;
      res.send({ok:true,msg:'注册成功'});
    }
  });*/

//聊天室部分



  io.on('connection', function(socket){

    onlineUsers.push({username:reqUserName,id:socket.id,nickname:"",iconSrc:""});
      io.emit("onlineUsers",onlineUsers);


    socket.on('enterRoom',function(nickname, icon){
      
      onlineUsers.elem(socket.id,"nickname",nickname);
      onlineUsers.elem(socket.id,"iconSrc",icon);
      io.emit("prompt", reqUserName,nickname, "加入了群聊"); 
    
    socket.on("message", function (msg) {
      msg.id = socket.id;
      msg.user=onlineUsers.elem(socket.id,'username');
      msg.nickname=onlineUsers.elem(socket.id,'nickname');
      msg.iconSrc=onlineUsers.elem(socket.id,'iconSrc');
      console.log(onlineUsers);
      io.emit("message", msg);

    })
})
    socket.on('disconnect', function(){

      if (onlineUsers.elem(socket.id,"nickname")){
      io.emit("prompt", onlineUsers.elem(socket.id,"username"), 
      onlineUsers.elem(socket.id,"nickname"),"退出了群聊"); 
      }
     
      while(onlineUsers.elem(socket.id) instanceof Object){
      onlineUsers.splice(onlineUsers.elem(socket.id),1);
      }
    

      io.emit("onlineUsers",onlineUsers);
      })
})