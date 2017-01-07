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
		this.swipesArray = [];
		var obj = this;
		window.addEventListener("touchstart", function(e){obj.swipeStart(e)});
		window.addEventListener("touchend" , function(e){obj.swipeEnd(e)});
	}
	swipeStart(e){
		this.lastX = e.changedTouches[0].pageX;;
		this.lastY = e.changedTouches[0].pageY;;
	}
	swipeEnd(e){
		var currentX = e.changedTouches[0].pageX;
		var currentY = e.changedTouches[0].pageY; 
		var dX = this.lastX - currentX;
		var dY = this.lastY - currentY;
		dX*= (dX < 0) ? (-1) : 1;
		dY*= (dY < 0) ? (-1) : 1;
		this.swipesArray.push({"x":dX,"y":dY});
		console.log(this.swipesArray);
		if(this.swipesArray.length % 10 == 0 ){
			var minX = this.swipesArray[0]["x"];
			var minY = this.swipesArray[0]["y"];
			for(var key in this.swipesArray){
				if(key["x"] < minX){
					minX = this.swipeArray[key]["x"]
				}
				if(key["y"] < minY){
					minY = this.swipeArray[key]["y"]
				}
			}
			alert("minX = " + minX + ", minY = " + minY)
		}
	}
}