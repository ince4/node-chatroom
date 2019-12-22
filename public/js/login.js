//切换登陆/注册
var $leftButton = $('#left_button');
var $rightButton = $('#right_button');

//登陆按钮与注册按钮
var $login_btn = $('#login_btn');
var $reg_btn = $('#reg_btn');

//输入框
var $userNameInputBox = $('#user')
var $passInputBox = $('#pass')
var $passConfirmBox = $('#pass-confirm')

//登陆/注册窗口 
var $loginWindow= $('.sign');
var $cover = $('#cover');
var $redButton = $('.sign input[type=button]');

// × 关闭登陆/注册窗口 
var $XButton = $('#x');
$XButton.on("click",function(){
    $loginWindow.hide();
    $cover.hide();
    document.body.style.overflow='auto';
    removeInputValues();
    removeTips();
})

//单击$loginWindow或导航条登陆打开登陆窗口
var $signShow = $('.sign-show')
$signShow.on("click",function(){
    document.body.style.overflow='hidden';
    $cover.show();
    $loginWindow.show();
})

//登陆窗口点击登陆或注册按钮后样式改变
var loginStatus = "login";
function loginStatusToggle(windowHeight,buttonTop,targetElement){
    var $targetElement = $(targetElement);
    $targetElement.siblings().attr('data-checked','none');
    $targetElement.attr('data-checked','checked');
    $loginWindow.css('height',windowHeight);
    $redButton.css('top',buttonTop);
    $passConfirmBox.toggle();
    $reg_btn.toggle();
    $login_btn.toggle();
    if (loginStatus === "login"){
        $userNameInputBox.attr("placeholder","请输注册用户名")
        $passInputBox.attr("placeholder","请输入注册密码")
    }
    else{
        $userNameInputBox.attr("placeholder","请输入用户名")
        $passInputBox.attr("placeholder","请输入密码")
    }
    removeTips();
    removeInputValues();
}

$leftButton.on("click",function(e){
    if (loginStatus === "register"){
        loginStatusToggle(300,225,e.target);
        loginStatus = "login";
       
    }
})

$rightButton.on("click",function(e){
    if (loginStatus === "login"){
        loginStatusToggle(360,290,e.target);
        loginStatus = "register";
    }
})

function removeTips(){
  $userNameInputBox.parent().attr('data-content','');
  $passInputBox.parent().attr('data-content','');
  $passConfirmBox.parent().attr('data-content','');
  $userNameInputBox.css('borderColor','#ccc')
  $passInputBox.css('borderColor','#ccc')
  $passConfirmBox.css('borderColor','#ccc')
}
function removeInputValues(){
  $userNameInputBox.val("");
  $passInputBox.val("");
  $passConfirmBox.val("");
}
function inputBoxTips(e,msg){
  e.css('borderColor','red');
  e.parent().attr('data-content',msg);
}
// var socket = io();
//登陆按钮事件
    $login_btn.click(function(){
      removeTips();
      if($userNameInputBox.val().length == 0){
        inputBoxTips($userNameInputBox,"请输入用户名");
      }
      if($passInputBox.val().length == 0){
        inputBoxTips($passInputBox,"请输入密码");
      }

      $.ajax({
        url:'/login',
        type:'POST',
        data:{
          act:'login',
          user:$userNameInputBox.val(),
          pass:$passInputBox.val()
        },
        success:function(json){
          if(json.ok){
            window.location.href="/views/chatroom.html";
          }else{
            if(json.hint === -1){
              inputBoxTips($passInputBox,json.msg);
            }
            else{
              inputBoxTips($userNameInputBox,json.msg);
            }
          }
        },
        error:function(err){
          console.log(err);
        }
      });

    });
    
//注册按钮事件
    $("#reg_btn").click(function(){
      if($userNameInputBox.val().length == 0){
        inputBoxTips($userNameInputBox,"请输入注册用户名");
      }
      if($passInputBox.val().length == 0){
        inputBoxTips($passInputBox,"注册密码不能为空");
      }
      if($passConfirmBox.val().length == 0){
        inputBoxTips($passConfirmBox,"请再次输入注册密码");
      }
      if($passConfirmBox.val()!==$passInputBox.val()){
        inputBoxTips($passConfirmBox,"两次输入密码内容不一致");
        $passConfirmBox.val("");
        $passInputBox.val("");
      }


      $.ajax({
        url:"/reg",
        type:"POST",
        data:{
          act:"reg",
          user:$userNameInputBox.val(),
          pass:$passInputBox.val()
        },
        success:function(json){
          // var json = eval("("+str+")");
          if(json.ok){
            alert("注册成功");
            loginStatusToggle(300,225,$leftButton);
            loginStatus = "login";
            $userNameInputBox.val("");
            $passConfirmBox.val("");
            $passInputBox.val("");
          }else{
            inputBoxTips($userNameInputBox,json.msg);
          }
        },
        error:function(err){
          console.log(err);
        }
      });
    });