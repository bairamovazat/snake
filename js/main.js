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
		this.nextBox = null;
		this.setBox();
	}
	setBox(){
		var div = document.createElement("div");
		div.id = this.boxName;
		div.style = "width:"+(boxWidth-2)+"px;height:"+(boxHeight-2)+"px;border:1px solid;position:absolute;top:" + (this.y*boxHeight) + "px;left:" + (this.x*boxWidth) + "px;background-color:"+ this.color+";";
		getById('mainBox').appendChild(div);
		this.self = getById(this.boxName);
	}
	deleteBox(){
			if(this.self != null && this.self.parentNode!= null){
				this.self.parentNode.removeChild(this.self);
			}
			var obj = this;
			delete this.x, this.y, this.route, this.boxName, this.nextBox, this.self, obj;
	}
	moveBox(x,y){
		if(((x <= (allUnitsWidth-1) & x>=0 & y >= 0 & y <= (allUnitsHeight-1)) || outputForTheField) && x != null && x != undefined && y != null && y!= undefined ){
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
	getCloneBox(){
		let boxName = this.boxName.split(':')[0] + ":" + (1 + Number(this.boxName.split(':')[1])); 
		var box = new SnakeBox(this.x, this.y, this.route, boxName, this.color);
		return box;
	}
	getX(){
		return this.x;
	}
	getY(){
		return this.y;
	}
	getColor(){
		return this.color;
	}
	getNextBox(){
		return  this.nextBox;
	}
	getRoute(){
		return this.route;
	}
	toString(){
		return("name: " + this.boxName + "\nx: " + this.x + "\ny: " + this.y + "\ncolor: " + this.color + "\nroute: " + this.route + "\n");
	}
}
class Snake{
	constructor(x,y,block,buildRoute,snakeName, color){
		var buildRoute = routeMap[buildRoute];
		var snakeRoute = routeMap["up"];
		this.snakeName = snakeName;
		this.topBox = new SnakeBox(x,y,snakeRoute,this.snakeName+":"+0, color);
		this.lastBox = this.topBox;
		//this.topBox.self = "background-color:black";
		/*var lastBox = this.topBox;
		x+=buildRoute[0];
		y+=buildRoute[1];
		for(var i = 1;i<block; i++){
			var currentBox = new SnakeBox(x,y,snakeRoute,this.snakeName + ":" + i, color);
			lastBox.setNextBox(currentBox);
			lastBox = currentBox;
			x+=buildRoute[0];
			y+=buildRoute[1];
		}*/
		for(var i = 1;i<block; i++){
			this.appendBox();
		}
	}
	appendBox(){
		var box = this.lastBox.getCloneBox();
		this.lastBox.setNextBox(box);
		this.lastBox = box;
		var route = inversRoute(box.getRoute())
		this.lastBox.moveBox(this.lastBox.getX() + route[0],this.lastBox.getY() + route[1]);
	}
	popBox(){
		if(this.lastBox == null && this.topBox == null){
			log('snake destroy');
			return(false);
		}
		if(this.lastBox == this.topBox){
			this.lastBox.deleteBox();
			this.topBox.deleteBox();
			this.lastBox = null;
			this.topBox = null;
			log('snake destroy');
			return(true);
		}
		var currentBox = this.topBox;
		while(currentBox.getNextBox() != this.lastBox){
			currentBox = currentBox.getNextBox();
		}
		var lastBox = currentBox.getNextBox(); 
		currentBox.setNextBox(null);
		lastBox.deleteBox();
		this.lastBox = currentBox;
		return(true)
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
	getLastBox(){
		return this.lastBox;
	}
	getX(){
		return this.topBox.getX();
	}
	getY(){
		return this.topBox.getY();
	}
	/*disguise(time){
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
	}*/
}
class snakeController{
	constructor(obj, gameMap){
		this.moveTime = 300; // скорость передвижения;
		this.nextRoute = null;
		this.route = null;
		this.snake = obj;
		this.moveTimeOut = null;
		this.gameMap = gameMap;
	}
	appendBox(){
		this.snake.appendBox();
	}
	popBox(){
		this.snake.popBox();
	}
	removedFromThisBox(box){
		if(box instanceof SnakeBox){
			var currentBox = this.snake.getTopBox();
			while(box != null || box != undefined || box != currentBox){
				currentBox = currentBox.getNextBox();
			}
			if(currentBox != (null || undefined)){ 
				while(this.snake.getLastBox() != currentBox){
					this.popBox();
				}
			} 
		}
	}
	destroySnake(){
		this.moveTimeOut = null;
		while(this.snake.popBox() == true){log('удалён последний элемент из змейки')}
		var obj = this;
		delete obj.snake;
		alert("Вы проиграли :(")
		this.resetSnake();
	}
	left(){
		if(this.moveTo("left") == false){return;}
		this.snake.move("left");
	}
	right(){
		if(this.moveTo("right") == false){return;}
		this.snake.move("right");
	}
	up(){
		if(this.moveTo("up") == false){return;}
		this.snake.move("up");
	}
	down(){
		if(this.moveTo("down") == false){return;}
		this.snake.move("down");
	}
	moveTo(route){
		var route = routeMap[route];
		var x = this.snake.getX() + route[0];
		var y = this.snake.getY() + route[1];
		log(x + ":" + y )
		if(this.gameMap.goTo(this, x, y) == false){return false}; // return false - следующий ход не засчитывается , true - звсчитывается;
	}
	recusiveMove(){
		var obj = this;
		obj.setMoveTimeOut(obj);
	}
	resetSnake(){
		this.snake = new Snake(6, 4, 5, "down", "first", "red"); ///////
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
}
class gameController{
	constructor(){
		var obj = this;
		this.snakesArray = {};
		this.keyPressMap = {};
		this.gameMap = new GameMap();
		document.onkeydown = function(e){
			obj.keyPress(e);
		}
	}
	addSnake(x,y,boxs,route,name,color){
		var snake = new snakeController(new Snake(x,y,boxs,route,name,color), this.gameMap)
		this.snakesArray[name] = snake;
	}
	setControl(type, snakeName, autoControl ){
		var obj = this;
		if(type == 'arrows' && autoControl == false){
			this.keyPressMap[38] = function(){obj.snakesArray[snakeName].up();}
			this.keyPressMap[39] = function(){obj.snakesArray[snakeName].right();}
			this.keyPressMap[40] = function(){obj.snakesArray[snakeName].down();}
			this.keyPressMap[37] = function(){obj.snakesArray[snakeName].left();}
			this.keyPressMap[107] = function(){obj.snakesArray[snakeName].appendBox();}
			this.keyPressMap[109] = function(){obj.snakesArray[snakeName].popBox();}
		}
		else if(type == 'character' && autoControl == false){
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
		else if(type == 'character' && autoControl == true){
			this.keyPressMap[87] = function(){obj.snakesArray[snakeName].setNextRoute("up");}
			this.keyPressMap[68] = function(){obj.snakesArray[snakeName].setNextRoute("right");}
			this.keyPressMap[83] = function(){obj.snakesArray[snakeName].setNextRoute("down");}
			this.keyPressMap[65] = function(){obj.snakesArray[snakeName].setNextRoute("left");}
			this.snakesArray[snakeName].recusiveMove();
		}
	}
	keyPress(key){
		try{return this.keyPressMap[key.keyCode]();}catch(e){log(getInfoByKey(key) + "\n" + 'Ошибка ' + e.name + ":" + e.message + "\n" + e.stack)}
	}
}
/*class Point(){
	constructor(){ 
	}
	setRandomDot(){
		var x = getRandomInt(0, allUnitsWidth)
		var y = getRandomInt(0, allUnitsHeight)

	}
}*/
class GameMap{
	constructor(){
		this.gameMap = {};
	}
	add(obj, x, y){
		if(this.gameMap[x, y] != (null || undefined )){
			log('Данный блок занят!! Не записан в gameMap!!!');
			return;
		}
		this.gameMap[x, y] = obj;
	}
	goTo(callObj, x, y){
		if(callObj instanceof snakeController){
			if(x >= allUnitsWidth || x < 0 || y >= allUnitsHeight || y < 0){
				callObj.destroySnake();
				return false;
			}	
		}
	}
	get(x, y){
		return this.gameMap[x, y];
	}
}
class Game{
	constructor(){
		var obj = this;
		getById("mainBox").style = "width:"+width+"px;height:"+height+"px;display:block";
		getById("start").onclick = function(){
			obj.start();
		}
	}
	start(){
		getById("mainStart").style.display = "none";
		this.initBlock();
		this.controller = new gameController();
		this.controller.addSnake(6, 4, 5, "down", "first", "red");
		this.controller.setControl('arrows', 'first',  false);
		//this.controller.addSnake(4, 4, 5, "down", "second", "green");
		//this.controller.setControl('character', "second", true);
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
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function log(logs){
	if(debug){
		console.log(logs);
	}
}
function main(){
	var game = new Game();
}
