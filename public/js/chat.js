var socket = io();
var activeUser;
var nickname;

// document.onkeydown = function ()
// {
//     if (event.keyCode == 116) {
//         event.keyCode = 0;
//         event.cancelBubble = true;
//         return false;
//     }
// }

// //禁止右键弹出菜单
// document.oncontextmenu = function () {
//     return false;
// }

function addPrompt(msg,style) {
    var $newmsg = $('<li>'+msg+'</li>');
    if(style){
      $newmsg.addClass(style);
    }
    $('#messages').append($newmsg);
    document.documentElement.scrollTop=$('#messages').height();
}

function addMsg(msg,style) {
  var $newmsg = $(`<li class="chatBubble ${style}"><a class="userIcon" style="background-image:url(${msg.iconSrc})"></a> <div class="userName">${msg.nickname}</div>
  <div class="message">${msg.content}</div><div style ="clear:both"></div></li>`);
  $('#messages').append($newmsg);
  document.documentElement.scrollTop=$('#messages').height();
}

//一次性函数 获取客户端上登陆用户的用户名
var sca = function(user) {
  activeUser=user;
  sca = function() {
      return user;
  }
  return user;
}

  socket.on("prompt", function (user,nickname,tips) {
    // activeUser=user;
    sca(user);
    addPrompt(nickname + tips,'promt');
  })

$('form').submit(function () {
    var msg ={
      content:$("#m").val(),
      time : Date.now()
    }
    socket.emit("message", msg); //将消息发送给服务器
    $("#m").val(""); //置空消息框
    
    return false //阻止form提交
  })
  
  socket.on("message", function(msg) {
    console.log(JSON.stringify(msg));
    if (msg.content && !msg.content.match(/^[ ]*$/) ){
      if(activeUser === msg.user){
      addMsg(msg,"myself");
      }
      else
      addMsg(msg,"others");
    }
  })

