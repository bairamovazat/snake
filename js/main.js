document.addEventListener("DOMContentLoaded", main);
const width = 600;
const height = 600;
const allUnitsWidth = 15; // всего блоков по  ширине
const allUnitsHeight = 15; // всего блоков по  высоте
const boxWidth = width / allUnitsWidth;
const boxHeight = height / allUnitsHeight;
const routeMap = {"up":[0,-1],"down":[0,1],"left":[-1,0],"right":[1,0]}
const speed = 300;

class SnakeBox{
	/*
	поля:
	x - координата по горизонтали вправо
	y - координата по вертикали вниз
	route - направление блока(куда он будет двигаться в след раз)
	boxName - имя(id) блока
	self - ссылка на DOM элемент
	nextBox - следующий блок змейки(начало с головы)
	*/
	constructor(x, y, route, boxName){	
		this.x = x;
		this.y = y;
		this.route = route;
		this.boxName = boxName;
		this.setBox();
	}
	setBox(){
		var div = document.createElement("div");
		div.id = this.boxName;
		div.style = "width:"+(boxWidth-2)+"px;height:"+(boxHeight-2)+"px;border:1px solid;position:absolute;top:" + (this.y*boxHeight) + "px;left:" + (this.x*boxWidth) + "px;background-color:red;";
		getById('mainBox').appendChild(div);
		this.self = getById(this.boxName);
	}
	deleteBox(time){
			if(this.self != null && this.self.parentNode!= null){
				this.self.parentNode.removeChild(this.self);
			}
	}
	moveBox(x,y){
		if(x <= (allUnitsWidth-1) & x>=0 & y >= 0 & y <= (allUnitsHeight-1)){
			this.x = x;
			this.y = y;
			this.self.style.top = (this.y*boxHeight) + "px";
			this.self.style.left = (this.x*boxWidth) + "px";
		}
	}
	moveLeft(){
		this.moveBox(this.x-1,this.y);
	}
	moveRight(){
		this.moveBox(this.x+1,this.y);
	}
	moveUp(){
		this.moveBox(this.x,this.y-1);
	}
	moveDown(){
		this.moveBox(this.x,this.y+1);
	}
	getStyle(style){
		return getById(this.boxName).style;
	}
	setNextBox(nextBox){
		this.nextBox = nextBox;
	}
	setRoute(route){
		this.route = route;
	}
	getX(){
		return this.x;
	}
	getY(){
		return this.y;
	}
	getNextBox(){
		return  this.nextBox;
	}
	getRoute(){
		return this.route;
	}
}
class Snake{
	/*
	поля:
	topBox - главный блок змейки(голова)
	
	*/
	constructor(x,y,block,route){
		var route = routeMap[route];
		var route2 = routeMap["up"];
		this.route = route2;
		this.nextRoute = route2;
		this.topBox = new SnakeBox(x,y,route2,"Snake"+x+y);
		//this.topBox.getStyle().backgroundColor = "#CC0000";
		var lastBox = this.topBox;
		x+=route[0];
		y+=route[1];
		for(var i = 1;i<block; i++){
			let currentBox = new SnakeBox(x,y,route2,"Snake"+x+y);
			lastBox.nextBox = currentBox;
			lastBox = currentBox;
			x+=route[0];
			y+=route[1];
		}
		var obj = this;
		Snake.prototype.recursiveMove(obj);
	}

	recursiveMove(obj){
		obj.move();
		setTimeout(function(){Snake.prototype.recursiveMove(obj)}, speed);
	}
	/*constructor(x,y,block,route){
		var routeMap = {"up":[0,-1],"down":[0,1],"left":[-1,0],"right":[1,0]}
		var route = routeMap[route];
		var route2 = routeMap["up"];
		this.boxArray = [];
		for(var i = 0;i<block; i++){
			this.boxArray.push(new SnakeBox(x,y,route2,"Snake"+x+y));
			x+=route[0];
			y+=route[1];
		}
		alert(this.boxArray.length);
	}*/
	routeInvers(route){
		var returnRoute = [0,0]; 
		if(route[0]<0){
			returnRoute[0]=1;
		}else if(route[0]>0){
			returnRoute[0]=-1;
		}

		if(route[1]<0){
			returnRoute[1]=1;
		}else if(route[1]>0){
			returnRoute[1]=-1;
		}
		return returnRoute;
	}
	left(){
		this.move([-1,0]);
	}
	right(){
		this.move([1,0]);
	}
	up(){
		this.move([0,-1]);

	}
	down(){
		this.move([0,1]);
	}
	/*move(route){
	
		for(let i = 0; i < this.boxArray.length; i++ ){
			let bufferRoute = this.boxArray[i].getRoute();
			this.boxArray[i].setRoute(route);
			this.boxArray[i].moveBox(this.boxArray[i].getX() + route[0],this.boxArray[i].getY() + route[1]);
			alert((this.boxArray[i].getX() + route[0])+":"+(this.boxArray[i].getY() + route[1]));
			route = bufferRoute;
		}
	}*/
	move(){
		var route = this.route;
		var checkRoute = Snake.prototype.routeInvers(route);
		if(this.topBox == null || (this.topBox.getRoute()[1] == checkRoute[1] && this.topBox.getRoute()[0] == checkRoute[0])) {
			return;
		}
		var currentBox = this.topBox;
		var bufferRoute = route;
		while(currentBox != null){
			var currentX = Number(currentBox.getX())+Number(route[0]);
			var currentY = Number(currentBox.getY())+Number(route[1]);
			if(currentX >= allUnitsWidth | currentX < 0 | currentY >= allUnitsHeight | currentY < 0){
				this.destroy();
				return; // ---------------------------
			}
			currentBox.moveBox(currentX, currentY);
			route = currentBox.getRoute();
			currentBox.setRoute(bufferRoute);
			bufferRoute = route;
			var currentBox  = currentBox.getNextBox();
		}
		this.route = this.nextRoute;
	}
	set Route(rou){
		if(this.routeInvers(routeMap[rou])[0] != this.route[0] && this.routeInvers(routeMap[rou])[1] != this.route[1]){
			this.nextRoute = routeMap[rou];
		}
	}
	getTopBox(){
		if(this.topBox == null){
			return false;
		}
		return this.topBox;
	}
	topBoxIsExist(){
		if(this.topBox == null){
			return false;
		}else{
			return true;
		}
	}
	destroy(time){
		this.recursiveDestroyBoxs(this.topBox,100);
		this.topBox = null;
	}
	recursiveDestroyBoxs(topBox,time){
		setTimeout(function(){
			var bufferBox = topBox.getNextBox();
			topBox.deleteBox();
			topBox = null;
			if( bufferBox != null){
				Snake.prototype.recursiveDestroyBoxs(bufferBox, time);
			}
		}, time);
	}
}
class Game{
	initSnake(x,y){// устанавливает базовый блок на блоке x,y
		//this.firstBox = new SnakeBox(0,0,"firstBox");
		this.snake = new Snake(4,4,4,"down"); 

	}
	constructor(){

	}
	start(){
		getById("mainStart").style.display = "none";
		this.initBlock();
		this.initSnake();
	}
	initBlock(){
		var i = 0, j = 0;
		for(i = 0;i<(height-(boxHeight*0.5));i+=boxHeight){
			for(j = 0;j<(width-(boxWidth*0.5)); j+=boxWidth){
				let div = document.createElement("div")
				div.className = "box"+i+""+j;
				div.style = "width:"+(boxWidth-2)+"px;height:"+(boxHeight-2)+"px;border:1px solid;position:absolute;top:" + i + "px;left:" + j + "px;";
				getById('mainBox').appendChild(div);
			}
		}
	}
}

function getById(name){
	return document.getElementById(name);
}
function main(){
	var game = new Game();
	getById("mainBox").style = "width:"+width+"px;height:"+height+"px;display:block"
	getById("start").onclick = function(){
		game.start();
		document.onkeypress = function(e){
			if(e.keyCode==39){
				game.snake.Route = "right";
			}else if(e.keyCode == 40){
				game.snake.Route = "down";
			}else if(e.keyCode == 38){
				game.snake.Route = "up";
			}else if(e.keyCode == 37){
				game.snake.Route = "left";
			}
		}
	}
}
