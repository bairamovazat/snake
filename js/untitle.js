document.addEventListener("DOMContentLoaded", main);
function main(){
	var swipe = new Swipe();
}

function getById(dom) {
	return document.getElementById(dom);
}
function getByTag(tag){
	return document.getElementsByTagName(tag)[0];
}
class Swipe{
	constructor(){
		alert("init Swipe")
		this.x;
		this.y;
		this.minSwipeLength = 200;
		var obj = this;
		window.addEventListener("touchstart", function(e){obj.swipeStart(e)});
		window.addEventListener("touchend" , function(e){obj.swipeEnd(e)});
	}
	swipeStart(e){
		this.lastX = e.changedTouches[0].pageX;;
		this.lastY = e.changedTouches[0].pageY;;
	}
	swipeEnd(e){
		var swipe = "notswipe";
		var len = this.minSwipeLength;
		var currentX = e.changedTouches[0].pageX;
		var currentY = e.changedTouches[0].pageY; 
		var dX = currentX - this.lastX ;
		var dY = currentY - this.lastY;
		if(Math.abs(dX) >= len && Math.abs(dY) >= len){
			if(Math.abs(dX) > Math.abs(dX)){
				swipe = (dX > 0)? "right" :"left"; 
			}else{
				swipe = (dY > 0)? "down" : "up"; // данные расчитаны на обычную координатную плоскость	
			}
		}else if(Math.abs(dX) >= len){
			swipe = (dX > 0)? "right" :"left";
		}else if(Math.abs(dY) >= len){
			swipe = (dY > 0)? "up" :"down";
		}
		alert(swipe + "as");
	}
}