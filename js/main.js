document.addEventListener("DOMContentLoaded", main);
const debug = true;
const outputForTheField = false;
const cuttingDownSnake = true; //выбор срезать змейку или польностью удалять при столкновении 
var width = 600;
var height = 600;
var allUnitsWidth = 15; // всего блоков по  ширине
var allUnitsHeight = 15; // всего блоков по  высоте
var boxWidth = width / allUnitsWidth;
var boxHeight = height / allUnitsHeight;
const routeMap = {"up":[0,-1],"down":[0,1],"left":[-1,0],"right":[1,0]}
const speed = 300;
const bodyBorder = 6;
class SnakeBox{
	constructor(x, y, route, boxName, color){
		this.color = color;
		this.x = x;
		this.y = y;
		this.route = route;
		this.boxName = boxName;
		this.nextBox = null;
		this.setBox();
		gameMap.add(this,x,y);
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
			gameMap.clear(this.x, this.y);
			this.x = x;
			this.y = y;
			gameMap.add(this, x, y);
			this.self.style.top = (this.y*boxHeight) + "px";
			this.self.style.left = (this.x*boxWidth) + "px";
			//log(gameMap.get(x,y))
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
	getCloneBox(data){
		if (data = 'goBack'){
			var route = inversRoute(this.getRoute())
			var x = this.getX() + route[0];
			var y = this.getY() + route[1];
		}else{
			var x = this.x;
			var y = this.y;
		}

		let boxName = this.boxName.split(':')[0] + ":" + (1 + Number(this.boxName.split(':')[1])); 
		var box = new SnakeBox(x, y, this.route, boxName, this.color);
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
		var box = this.lastBox.getCloneBox('goBack');
		this.lastBox.setNextBox(box);
		this.lastBox = box;
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
	constructor(x,y,boxs,route,name,color,gameController){
		this.score = 0;
		this.gameController = gameController;
		this.moveTime = speed; // скорость передвижения;
		this.nextRoute = null;
		this.route = null;
		this.snake = new Snake(x,y,boxs,route,name,color);
		this.moveTimeOut = null;
		this.referenceData = { "x" : x ,"y" : y ,"boxs" : boxs ,"route" : route ,"name" : name ,"color" : color };
	}
	appendBox(){
		this.snake.appendBox();
	}
	popBox(){
		this.snake.popBox();
	}
	addPoint(){
		this.score += 1;
		this.appendBox();
		log("score: " + this.score + "------------------");
	}
	containsBlock(box){
		var currentBox = this.snake.getTopBox();
		while(currentBox != (null||undefined)){
			if(currentBox == box){
				return true;
			}
			currentBox = currentBox.getNextBox();
		} 
		return false;
	}
	removedFromThisBox(box){
		if(box instanceof SnakeBox){
			if(this.containsBlock == false){
				return false;
			}
			var currentBox = this.snake.getTopBox();
			while(currentBox != (null || undefined ) && box != currentBox){
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
		var currentBox = this.snake.getTopBox();
		while(currentBox != (null || undefined)){
			gameMap.clear(currentBox.getX(),currentBox.getY());
			currentBox = currentBox.getNextBox();
		}
		while(this.snake.popBox() == true){log('удалён последний элемент из змейки')}
		var obj = this;
		delete obj.snake;
		this.route = null;
		this.nextRoute = null;
		this.gameController.snakeDestroyed(this.referenceData["name"]);
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
		if( route == null  || oppositeValues(this.snake.topBox.getRoute(), route)) {
			log("ошибка перемещения змейки")
			return; // проверка на вхождение змейки в себя || отсутствия значения 
		}
		var route = routeMap[route];
		var x = this.snake.getX() + route[0];
		var y = this.snake.getY() + route[1];
		if(gameMap.goTo(this, x, y) == false){return false}; // return false - следующий ход не засчитывается , true - звсчитывается;
	}
	move(route){
		if(this.moveTo(route) == false){
			return false;
		}
		this.snake.move(route);
	}
	recusiveMove(){
		var obj = this;
		obj.setMoveTimeOut(obj);
	}
	resetSnake(){
		var data = this.referenceData;
		this.snake = new Snake(data["x"],data["y"],data["boxs"],data["route"],data["name"],data["color"]); 
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
		var snakeRoute = this.snake.getTopBox().getRoute();
		if(oppositeValues(snakeRoute , route) == true || route == false){
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
				obj.move(obj.getRoute());
				obj.setMoveTimeOut(obj)
			},obj.getMoveTime())
	}
}

class gameController{
	constructor(){
		var obj = this;
		this.snakesArray = {};
		this.keyPressMap = {};
		this.gameMap = new GameMap(this); // можно не присваивать к определённой переменной так как после создания объекта он сам записывается в window.gameMap
		this.point = new Point();
		document.onkeydown = function(e){
			obj.keyPress(e);
		}
		this.snakesSum = 0;
	}
	addSnake(x,y,boxs,route,name,color){
		var snake = new snakeController(x,y,boxs,route,name,color,this)
		this.snakesArray[name] = snake;
		this.snakesSum += 1;
	}
	snakeDestroyed(snakeName){
		alert("Вы проиграли :( \nПопробуйте снова!");
		var length = this.getSnakesArrayLength()
		if (length <= 1	 && this.snakesSum < 2){
			this.snakesArray[snakeName].resetSnake();
		}
		else if( length <= 2 && this.snakesSum >=2){
			this.snakesArray[snakeName].resetSnake();
		}
		else{
			this.snakesArray[snakeName].resetSnake();
		}
	}
	getSnakesArrayLength(){
		var i = 0;
		for(var key in this.snakesArray){
			i ++;
		}
		return i;
	}
	getSnakesArrayNames(){
		var namesArray = [];
		for(var key in this.snakesArray){
			namesArray.push(key);
		}
		return namesArray;
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
			this.keyPressMap[96] = function(){log(gameMap.toString());}
		}
		else if(type == 'arrows' && autoControl == true){
			this.keyPressMap[38] = function(){obj.snakesArray[snakeName].setNextRoute("up");}
			this.keyPressMap[39] = function(){obj.snakesArray[snakeName].setNextRoute("right");}
			this.keyPressMap[40] = function(){obj.snakesArray[snakeName].setNextRoute("down");}
			this.keyPressMap[37] = function(){obj.snakesArray[snakeName].setNextRoute("left");}
			this.snakesArray[snakeName].recusiveMove();
		}
		else if(type == 'character' && autoControl == false){
			this.keyPressMap[87] = function(){obj.snakesArray[snakeName].up();}
			this.keyPressMap[68] = function(){obj.snakesArray[snakeName].right();}
			this.keyPressMap[83] = function(){obj.snakesArray[snakeName].down();}
			this.keyPressMap[65] = function(){obj.snakesArray[snakeName].left();}
		}
		else if(type == 'character' && autoControl == true){
			this.keyPressMap[87] = function(){obj.snakesArray[snakeName].setNextRoute("up");}
			this.keyPressMap[68] = function(){obj.snakesArray[snakeName].setNextRoute("right");}
			this.keyPressMap[83] = function(){obj.snakesArray[snakeName].setNextRoute("down");}
			this.keyPressMap[65] = function(){obj.snakesArray[snakeName].setNextRoute("left");}
			this.snakesArray[snakeName].recusiveMove();
		}else if(type == 'mobile' && autoControl == false){
			this.mobileController = new Swipe();
			this.mobileController.setUpFunc(function(){obj.snakesArray[snakeName].up();})
			this.mobileController.setRightFunc(function(){obj.snakesArray[snakeName].right();})
			this.mobileController.setDownFunc(function(){obj.snakesArray[snakeName].down();})
			this.mobileController.setLeftFunc(function(){obj.snakesArray[snakeName].left();})
		}else if(type == 'mobile' && autoControl == true){
			this.mobileController = new Swipe();
			this.mobileController.setUpFunc(function(){obj.snakesArray[snakeName].setNextRoute("up");})
			this.mobileController.setRightFunc(function(){obj.snakesArray[snakeName].setNextRoute("right");})
			this.mobileController.setDownFunc(function(){obj.snakesArray[snakeName].setNextRoute("down");})
			this.mobileController.setLeftFunc(function(){obj.snakesArray[snakeName].setNextRoute("left");})
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
class Point{ // нужно доделать от зацикливания, т.е точка выбирается рандомно
	constructor(){
		log("Вызов Point")
		this.color = "black";
		this.x;
		this.y;
		this.initPoint();
	}
	initPoint(){
		var coordinates = this.getRandomCoordinates(); 
		this.x = coordinates[0];
		this.y = coordinates[1];
		gameMap.add(this,this.x,this.y);
		this.name =  "point" + this.x + this.y;
		var div = document.createElement("div");
		div.id = this.name;
		div.style = "width:"+(boxWidth-2)+"px;height:"+(boxHeight-2)+"px;border:1px solid;position:absolute;top:" + (this.y*boxHeight) + "px;left:" + (this.x*boxWidth) + "px;background-color:"+ this.color+";";
		getById('mainBox').appendChild(div);
		this.self = getById(this.boxName);
	}
	setTo(x,y){
		gameMap.clear(this.x, this.y);
		this.x = x;
		this.y = y;
		gameMap.add(this, this.x, this.y);
		getById(this.name).style.top = this.y*boxHeight + "px";
		getById(this.name).style.left = this.x*boxWidth + "px"; 
	}
	resetPoint(){
		var coordinates = this.getRandomCoordinates();
		var x = coordinates[0];
		var y = coordinates[1];
		this.setTo(x,y);
	}
	getRandomCoordinates(){
		var i = 0 // на всякий , что бы не зациклилось
		do{
			var x = getRandomInt(0, allUnitsWidth-1);
			var y = getRandomInt(0, allUnitsHeight-1);
			i++;
			//log(x+","+y+";checkCoordinates: " + this.checkCoordinates(x,y));
		}while(this.checkCoordinates(x,y) == false && i < (allUnitsHeight * allUnitsWidth));
		if(i >= 20){alert("point вызвался "+ i + "раз"); return;};
		var bufferArray = [x,y];
		return bufferArray;
	}
	checkCoordinates(x,y){
		if(gameMap.get(x,y) == null){
			return true;
		}else{
			return false;
		}

	}
}
class GameMap{
	// можно сделать все пустые клетки gameMap равные clear или на подобии того. Но считаю, что это будет занимать больше по памяти , по этому пустые клетки не будут никак размечаться
	/*
	пустой
	конец поля
	своя змейка
	чужая змейка
	очко
	препятствие
	телепорт
	различные бонусы
	*/
	constructor(gameController){
		this.gameController = gameController; 
		window.gameMap = this; // gameMap объявил глобально так как были траблы с этим
		this.gameMap = {};
	}
	add(obj, x, y){
		if(this.get(x,y) != (null || undefined )){
			log('Данный блок занят!! Не записан в gameMap!!! объект: ' + obj );
			return;
		}else{
			this.set(obj,x,y);
			//log("Установлен блок на координаты: " + x + "," + y);
		}
		
	}
	goTo(callObj, x, y){
		var goToBox = this.get(x,y);
		if(x >= allUnitsWidth || x < 0 || y >= allUnitsHeight || y < 0){
			callObj.destroySnake();
			return false;
		}else if(goToBox instanceof SnakeBox){
			if(callObj.containsBlock(goToBox)){
				if(cuttingDownSnake){ // флаг на срезание змейки
					callObj.removedFromThisBox(goToBox);
					return true
				}else{
					callObj.destroySnake();
					return false;
				}
			}else{
				var bufferBox;
				while(goToBox != (null || undefined)){
					log("чужая змейка съедена до блока:" + goToBox);
					var bufferBox = goToBox.getNextBox();
					goToBox.deleteBox();
					goToBox = bufferBox;
				}
			}
		}else if(goToBox instanceof Point){
			callObj.addPoint();
			goToBox.resetPoint();
		}
	}
	set(obj,x,y){
		if(this.gameMap[x] == undefined){
			this.gameMap[x] = {};
			this.gameMap[x][y] = obj;
		}else{
			this.gameMap[x][y] = obj;
		}
	}
	get(x,y){
		if(this.gameMap[x] != (null||undefined)){
			return this.gameMap[x][y]
		}else{
			return null;
		}
	}
	clear(x, y){
		delete this.gameMap[x][y];
	}
	toString(){
		return (this.gameMap)
	}
}
class Game{
	constructor(){
		var obj = this;
		if(new DeviceType().mobile() == true){
			height = document.documentElement.clientHeight - (bodyBorder * 2); // расчитываем размеры с бордюром вместе
			width = document.documentElement.clientWidth - (bodyBorder * 2);
			boxWidth = (width / allUnitsWidth); // считаем размер блока относительно количества блоков
			boxHeight = boxWidth;
			allUnitsHeight = Math.floor(height / boxWidth); // считаем количество блоков по высоте
			width = boxWidth * allUnitsWidth; // теперь округляем высоту и ширину до круглых чисел
			height = boxHeight * allUnitsHeight ;
			this.snakesControllerType = "mobile"
		}else{
			this.snakesControllerType = "arrows"
		}
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
		this.controller.setControl(this.snakesControllerType, 'first',  true);
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
class Swipe{
	constructor(){
		this.swipeMap = {};
		this.swipeMap["up"] = function(){};
		this.swipeMap["right"] = function(){};
		this.swipeMap["down"] = function(){};
		this.swipeMap["left"] = function(){};
		this.swipeMap["notswipe"] = function(){};
		this.x;
		this.y;
		this.minSwipeLength = 150;
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