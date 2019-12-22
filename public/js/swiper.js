var count = 2 ; 
function next(){
count--;
count = count == -1?2:count;
$('#swiper div').eq(count).fadeIn(300).siblings('div').fadeOut(300); 
}
function reverse(){
count++;
count = count == 3?0:count;
$('#swiper div').eq(count).fadeIn(300).siblings('div').fadeOut(300);
}

var timer = setInterval(next,4000);
$(document).ready(function(){
$('.button_r').hover(function(){
clearInterval(timer);
},function(){
timer = setInterval(next,4000);
});
$('.button_l').hover(function(){
clearInterval(timer);
},function(){
timer = setInterval(next,4000);
});
$('.button_r').click(function(){
	next();
})
$('.button_l').click(function(){
	reverse();
	});
});