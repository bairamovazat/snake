document.addEventListener("DOMContentLoaded", main);
function main(){
	var swipe = new Swipe();
	swipe.setUpFunc(function(){example("up")});
	swipe.setDownFunc(function(){example("down")});
	swipe.setLeftFunc(function(){example("left")});
	swipe.setRightFunc(function(){example("right")});
}
function example(value){
	alert(value);
}
function getById(dom) {
	return document.getElementById(dom);
}
function getByTag(tag){
	return document.getElementsByTagName(tag)[0];
}
class Swipe{
	constructor(){
		var isMobile = new DeviceType().mobile();
		alert(isMobile)
		this.swipeMap = {};
		this.swipeMap["up"] = function(){};
		this.swipeMap["right"] = function(){};
		this.swipeMap["down"] = function(){};
		this.swipeMap["left"] = function(){};
		this.swipeMap["notswipe"] = function(){};
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
		var currentX = e.changedTouches[0].pageX;
		var currentY = e.changedTouches[0].pageY; 
		var dX = currentX - this.lastX ;
		var dY = currentY - this.lastY;
		var swipe = this.swipeDefinition(dX,dY);
		this.swipeMap[swipe]();
	}
	swipeDefinition(dX,dY){
		var len = this.minSwipeLength;
		var swipe = "notswipe";
		if(Math.abs(dX) >= len && Math.abs(dY) >= len){
			if(Math.abs(dX) > Math.abs(dX)){
				swipe = (dX > 0)? "right" : "left"; 
			}else{
				swipe = (dY > 0)? "down" : "up"; // данные расчитаны на обычную координатную плоскость	
			}
		}else if(Math.abs(dX) >= len){
			swipe = (dX > 0)? "right" : "left";
		}else if(Math.abs(dY) >= len){
			swipe = (dY > 0)? "down" : "up";
		}
		return swipe;
	}
	setUpFunc(func){
		this.swipeMap["up"] = func;
	}
	setDownFunc(func){
		this.swipeMap["down"] = func;
	}
	setLeftFunc(func){
		this.swipeMap["left"] = func;
	}
	setRightFunc(func){
		this.swipeMap["right"] = func;
	}
}
class DeviceType{
	constructor(){
		var obj = this;
		this.isMobile = {
		    Android: function() {
		        return navigator.userAgent.match(/Android/i);
		    },
		    BlackBerry: function() {
		        return navigator.userAgent.match(/BlackBerry/i);
		    },
		    iOS: function() {
		        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		    },
		    Opera: function() {
		        return navigator.userAgent.match(/Opera Mini/i);
		    },
		    Windows: function() {
		        return navigator.userAgent.match(/IEMobile/i);
		    },
		    any: function() {
		        return (obj.isMobile.Android() != null || obj.isMobile.BlackBerry() != null || obj.isMobile.iOS() || obj.isMobile.Opera() || obj.isMobile.Windows());
		    }
		};
	}
	mobile(){
		return this.isMobile.any() == null ? false : true;
	}
}