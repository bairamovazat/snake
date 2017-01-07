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
		this.x;
		this.y;
		var obj = this;
		window.addEventListener("mousedown", function(e){obj.swipeStart(e)});
		window.addEventListener("mouseup" , function(e){obj.swipeEnd(e)});
	}
	swipeStart(e){
		this.lastX = e.clientX;
		this.lastY = e.clientY;
	}
	swipeEnd(e){
		var currentX = e.clientX;
		var currentY = e.clientY; 
		var dX = this.lastX - currentX;
		var dY = this.lastY - currentY;
		dX*= (dX < 0) ? (-1) : 1;
		dY*= (dY < 0) ? (-1) : 1;
		alert(dX + ", " + dY);

	}
}