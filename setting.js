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
    myIconSrc = reads.result;

    var $croppedIcon = $('<label id = "croppedIcon"></label>');
    if($choices.find("#croppedIcon")[0] === undefined){
        $choices.prepend($croppedIcon);
    }

    $croppedIcon.css('background-image','url('+myIconSrc+')');
    $setting.animate({width:'800px',height:'500px'},700,cropperInterface())
    };

    
    $doneButton.css('display','block');
    $chosenDefault=$('input[name="icon-choose"]:checked');
    $chosenDefault.prop('checked', '');
}

    
    function cropperInterface(){
        var $cropFinish = $('#crop-finish');
        $('h2').text('裁剪头像');
        $choices.fadeOut(200);$doneButton.fadeOut(200);

        //img父元素容器
        var $editBox = $('<div><img class = "editImage"></img></div>');
        $editBox.css({ 'height': '400px', 'width': '400px',  'margin': '20px auto auto 30px'});
        
        //被裁剪图片
        $editImage = $editBox.find("img");
        $editImage.attr('src', myIconSrc);
        $editImage.css({ 'height': '400px', 'width': '400px', 'object-fit': 'cover'});

        //裁剪预览
        var $editPreview = $('<label style = "top:-400px; left:550px"></label>');
        $editPreview.css({ 'overflow': 'hidden'});
      
        $setting.append($editBox).append($editPreview);
        $cropFinish.css({'position': 'relative', 'top': '300px', 'left': '588px'});
        $cropFinish.show();
        
        //引入
        $editImage.cropper({
            aspectRatio: 1 / 1,
            viewMode:1,
            movable:false,
            scalable:false,
            zoomale:false,
            preview:$editPreview
        });

        //完成裁剪
        $cropFinish.on('click',function(){
            $setting.animate({width:'800px',height:'400px'})
            $choices.fadeIn(200);$doneButton.fadeIn(200);
            $editBox.fadeOut(200);
            $editImage.fadeOut(200);
            $editPreview.fadeOut(200);
            $cropFinish.fadeOut(200);
            
            var $newImg = $editImage.cropper('getCroppedCanvas');
            myIconSrc = $newImg.toDataURL('image/jpeg'); 
            var $croppedIcon = $("#croppedIcon");
            $croppedIcon.css('background-image','url('+myIconSrc+')');
        })
    }




$('.default').on('click',function(){
    $doneButton.css('display','block');
    })

var $chosenDefault;
$doneButton.on('click',function(){
    $doneButton.attr("disabled",true);
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
