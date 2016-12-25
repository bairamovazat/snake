document.addEventListener("DOMContentLoaded", main);
const debug = true;
const outputForTheField = false;
const width = 600;
const height = 600;
const allUnitsWidth = 15; // всего блоков по  ширине
const allUnitsHeight = 15; // всего блоков по  высоте
const boxWidth = width / allUnitsWidth;
const boxHeight = height / allUnitsHeight;
const routeMap = {"up":[0,-1],"down":[0,1],"left":[-1,0],"right":[1,0]}

class SnakeBox{
	constructor(x, y, route, boxName, color){
		this.color = color;
		this.x = x;
		this.y = y;
		this.route = route;
		this.boxName = boxName;
		this.setBox();
	}
	setBox(){
		var div = document.createElement("div");
		div.id = this.boxName;
		div.style = "width:"+(boxWidth-2)+"px;height:"+(boxHeight-2)+"px;border:1px solid;position:absolute;top:" + (this.y*boxHeight) + "px;left:" + (this.x*boxWidth) + "px;background-color:"+ this.color+";";
		getById('mainBox').appendChild(div);
		this.self = getById(this.boxName);
	}
	deleteBox(time){
			if(this.self != null && this.self.parentNode!= null){
				this.self.parentNode.removeChild(this.self);
			}
	}
	moveBox(x,y){
		if((x <= (allUnitsWidth-1) & x>=0 & y >= 0 & y <= (allUnitsHeight-1)) || outputForTheField){
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
	setStyle(style){
		this.self.style = style;
	}
	setColor(color){
		this.self.style.backgroundColor = color;
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
	constructor(x,y,block,buildRoute,snakeName, color){
		var buildRoute = routeMap[buildRoute];
		var snakeRoute = routeMap["up"];
		this.snakeName = snakeName;
		this.topBox = new SnakeBox(x,y,snakeRoute,this.snakeName+0, color);
		//this.topBox.self = "background-color:black";
		var lastBox = this.topBox;
		x+=buildRoute[0];
		y+=buildRoute[1];
		for(var i = 1;i<block; i++){
			let currentBox = new SnakeBox(x,y,snakeRoute,this.snakeName+i, color);
			lastBox.nextBox = currentBox;
			lastBox = currentBox;
			x+=buildRoute[0];
			y+=buildRoute[1];
		}
	}
	appendBox(){

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
	/*move(route){
	
		for(let i = 0; i < this.boxArray.length; i++ ){
			let bufferRoute = this.boxArray[i].getRoute();
			this.boxArray[i].setRoute(route);
			this.boxArray[i].moveBox(this.boxArray[i].getX() + route[0],this.boxArray[i].getY() + route[1]);
			alert((this.boxArray[i].getX() + route[0])+":"+(this.boxArray[i].getY() + route[1]));
			route = bufferRoute;
		}
	}*/
	move(route){
		if( route == null  || oppositeValues(this.topBox.getRoute(), route)) {
			log("ошибка перемещения змейки")
			return; // проверка на вхождение змейки в себя || отсутствия значения 
		}
		var route = routeMap[route];
		var currentBox = this.topBox;
		var bufferRoute = route;
		while(currentBox != null){
			var currentX = Number(currentBox.getX())+Number(route[0]);
			var currentY = Number(currentBox.getY())+Number(route[1]);
			if(currentX >= allUnitsWidth | currentX < 0 | currentY >= allUnitsHeight | currentY < 0){
				this.disguise();
				return;
			}
			currentBox.moveBox(currentX, currentY);
			route = currentBox.getRoute();
			currentBox.setRoute(bufferRoute);
			bufferRoute = route;
			var currentBox  = currentBox.getNextBox();
			
		}
	}
	getTopBox(){
		return this.topBox;
	}
	disguise(time){
		//this.recusiveDestroyBoxs(this.topBox,100);
		this.linalDisguiseBoxs(this.topBox);
	}
	linalDisguiseBoxs(topBox){
		while(topBox != null){
			log("linalDisguiseBoxs")
			topBox.setColor('transparent');
			topBox = topBox.getNextBox();
		}
	}
	recusiveDisguiseBoxs(topBox,time){
		setTimeout(function(){
			var bufferBox = topBox.getNextBox();
			topBox.setColor('transparent');
			if( bufferBox != null){
				Snake.prototype.recusiveDisguiseBoxs(bufferBox, time);
			}
		}, time);
	}
}
class snakeController{
	constructor(obj, name){
		this.moveTime = 300; // скорость передвижения;
		this.nextRoute = "up";
		this.route = null;
		this.snake = obj;
		this.moveTimeOut = null;
	}
	left(){
		this.snake.move("left");
	}
	right(){
		this.snake.move("right");
	}
	up(){
		this.snake.move("up");
	}
	down(){
		this.snake.move("down");
	}
	getRoute(){
		return this.route;
	}
	getNextRoute(){
		return this.nextRoute;
	}
	getMoveTime(){
		return this.moveTime;
	}
	setRoute(route){
		if(oppositeValues(this.route , route) == true || route == false){
			log('error snakeController.setRoute');
		}else{
			log("setRoute: this.Route = " + this.route + "; route = " + route);
			this.route = route;
		}
	}
	setNextRoute(route){
		if(oppositeValues(this.nextRoute , route) == true || route == false){
			log('error snakeController.setNextRoute');
		}else{
			log("setRoute: this.Route = " + this.nextRoute + "; route = " + route);
			this.nextRoute = route;
		}
	}
	setMoveTimeOut(obj){
		obj.moveTimeOut = setTimeout(
			function(){
				obj.setRoute(obj.getNextRoute());
				obj.snake.move(obj.getRoute());
				obj.setMoveTimeOut(obj)
			},obj.getMoveTime())
	}
	recusiveMove(){
		var obj = this;
		obj.setMoveTimeOut(obj);
	}
	reset(){

	}
}
class gameController{
	constructor(){
		var obj = this;
		this.snakesArray = {};
		this.keyPressMap = {};
		document.onkeydown = function(e){
				obj.keyPress(e);
			}
	}
	addSnake(x,y,boxs,route,name,color){
		var snake = new snakeController(new Snake(x,y,boxs,route,name,color))
		this.snakesArray[name] = snake;
	}
	setControl(type, snakeName, autoControl = false){
		var obj = this;
		if(type == 'arrows' && autoControl == false){
			this.keyPressMap[38] = function(){obj.snakesArray[snakeName].up();}
			this.keyPressMap[39] = function(){obj.snakesArray[snakeName].right();}
			this.keyPressMap[40] = function(){obj.snakesArray[snakeName].down();}
			this.keyPressMap[37] = function(){obj.snakesArray[snakeName].left();}
		}
		else if(type = 'character' && autoControl == false){
			this.keyPressMap[87] = function(){obj.snakesArray[snakeName].up();}
			this.keyPressMap[68] = function(){obj.snakesArray[snakeName].right();}
			this.keyPressMap[83] = function(){obj.snakesArray[snakeName].down();}
			this.keyPressMap[65] = function(){obj.snakesArray[snakeName].left();}
		}
		else if(type == 'arrows' && autoControl == true){
			this.keyPressMap[38] = function(){obj.snakesArray[snakeName].setNextRoute("up");}
			this.keyPressMap[39] = function(){obj.snakesArray[snakeName].setNextRoute("right");}
			this.keyPressMap[40] = function(){obj.snakesArray[snakeName].setNextRoute("down");}
			this.keyPressMap[37] = function(){obj.snakesArray[snakeName].setNextRoute("left");}
			this.snakesArray[snakeName].recusiveMove();
		}
		else if(type = 'character' && autoControl == true){
			this.keyPressMap[87] = function(){obj.snakesArray[snakeName].setNextRoute("up");}
			this.keyPressMap[68] = function(){obj.snakesArray[snakeName].setNextRoute("right");}
			this.keyPressMap[83] = function(){obj.snakesArray[snakeName].setNextRoute("down");}
			this.keyPressMap[65] = function(){obj.snakesArray[snakeName].setNextRoute("left");}
			this.snakesArray[snakeName].recusiveMove();
		}
	}
	keyPress(key){
		try{return this.keyPressMap[key.keyCode]();}catch(err){log(getInfoByKey(key))}
	}
}

class Game{
	constructor(){
		var obj = this;
		getById("mainBox").style = "width:"+width+"px;height:"+height+"px;display:block";
		getById("start").onclick = function(){
			obj.start();
		}
		//document.addEventListener("click",function(a){alert(a.target.id)});
	}
	start(){
		getById("mainStart").style.display = "none";
		this.initBlock();
		this.controller = new gameController();
		this.controller.addSnake(6, 4, 5, "down", "first", "red");
		this.controller.setControl('arrows', 'first',  false);
		this.controller.addSnake(4, 4, 5, "down", "second", "green");
		this.controller.setControl('character', "second", true);
	}
	initBlock(){
		var i = 0, j = 0;
		for(i = 0;i<(height-(boxHeight*0.5));i+=boxHeight){
			for(j = 0;j<(width-(boxWidth*0.5)); j+=boxWidth){
				let div = document.createElement("div")
				div.id = "box"+(i / boxHeight)+":"+(j / boxWidth);
				div.style = "width:"+(boxWidth-2)+"px;height:"+(boxHeight-2)+"px;border:1px solid;position:absolute;top:" + i + "px;left:" + j + "px;";
				getById('mainBox').appendChild(div);
			}
		}
	}
}
function getInfoByKey(e){
	if(debug == false){return;}
	return e.type +
    ' keyCode=' + e.keyCode +
    ' which=' + e.which +
    ' charCode=' + e.charCode +
    ' char=' + String.fromCharCode(e.keyCode || e.charCode) +
    (e.shiftKey ? ' +shift' : '') +
    (e.ctrlKey ? ' +ctrl' : '') +
    (e.altKey ? ' +alt' : '') +
    (e.metaKey ? ' +meta' : '') + "\n";
}

function getById(name){
	return document.getElementById(name);
}

function inversRoute(route){
	if(typeof route == "string"){
		route = routeMap[route];
		log('неправильный тип в inversRoute');
	}
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
function oppositeValues(route1, route2){
	if(typeof route1 == "string"){
		route1 = routeMap[route1];
	}
	if(typeof route2 == "string"){
		route2 = routeMap[route2];
	}
	if(route2 == null || route1 == null){
		return false;
	}
	route2 = inversRoute(route2);
	if(route1[0] == route2[0] && route1[1] == route2[1]){
		return true;
	}else{
		return false;
	}
}
function log(logs){
	if(debug){
		console.log(logs);
	}
}
function main(){
	var game = new Game();
}
