class snake{
	constructor(){

	}
	start(){
		getById("start").style.display = "none"
	}
}

function getById(name){
	return document.getElementById(name);
}
function start(){
	new snake = game;
	getById("start").onclick() = game.start(); 
}


