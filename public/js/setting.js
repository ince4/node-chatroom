var $cover = $('#cover');
var $setting = $('#setting');
var $illustrate = $('#illustrate');
var $choices = $('#choices');
var $typeNickname = $('#type-nickname');
var $nextButton = $('#toNext');
var $doneButton = $('#done');
var myNickname;

var socket = io();
//昵称不能包含空格
$typeNickname.on('keyup',function(){
    this.value=this.value.replace(/\s+/g,'');
})

var myIconSrc;
//进入头像选择界面
$nextButton.on('click',function(){
    if ($typeNickname.val()){
        myNickname = $typeNickname.val();
        $('h2').text('选择希望使用的头像');
        $illustrate.hide();
        $typeNickname.hide();
        $nextButton.hide();
        $setting.animate({width:'800px',height:'400px'},700,function(){
            $choices.fadeIn(700);
            $choices.css('display','flex');
        })
    }
})

//上传自定义头像 
var $upLoadIcon = $('input[type="file"]');

$upLoadIcon.attr('onchange','uploadfile2()');

function uploadfile2() {
    let reads = new FileReader();
    file = $upLoadIcon[0].files[0];
    
    var imageType = /^image\//;
    //判断文件类型
    if(!imageType.test(file.type)) {
        alert("请选择图片！");
        return;
    }
    reads.readAsDataURL(file);
    
    reads.onload = function () {
    $('input[name="icon-choose"]').next().hide();
    myIconSrc = reads.result;//
    let $preview = $('<label></label>');
    $preview.css('background-image','url('+myIconSrc+')');
    $choices.prepend($preview);
    };
    $doneButton.css('display','block');
    $chosenDefault=$('input[name="icon-choose"]:checked');
    $chosenDefault.prop('checked', '');
}


$('.default').on('click',function(){
    $doneButton.css('display','block');
    })

var $chosenDefault;
$doneButton.on('click',function(){
    $chosenDefault=$('input[name="icon-choose"]:checked');
    //选择默认头像
    if($chosenDefault.val() === 'male'){
        myIconSrc = "/img/ahiruguchi_man.jpg";
    } 
    else if ($chosenDefault.val() === 'female'){
        myIconSrc = "/img/ahiruguchi_woman.jpg";
    }
    
    //进入聊天室
    $cover.fadeOut(700);
    $('form').fadeIn(700);
    $('#messages').fadeIn(700);

    socket.emit('enterRoom',myNickname,myIconSrc);
    
})

$(function(){
    $cover.fadeIn(700);
})