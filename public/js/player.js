var c=document.getElementById('acro');
var sw=document.getElementById('player');
c.volume = 0.2;
sw.onclick=function function_ohyes() {

var s=document.getElementById('acro');

		if (s.paused){
			s.play();
			sw.style.backgroundImage="url(/img/p1.png)";
		}
		else {
			s.pause();
			sw.style.backgroundImage="url(/img/p2.png)"
		}
}
