var canvas = document.getElementById("canvas");
var width = window.innerWidth;
var height= window.innerHeight;
canvas.width  = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ballx = Math.floor(Math.random() * canvas.width/2) + canvas.width/2/2;
var bally = Math.floor(Math.random() * canvas.height/2) + canvas.height/2/2;
var dx = 5;
var dy = -5;
var paddleHeight = 50;
var paddleWidth = 50;
var paddleY = canvas.height-paddleHeight-10;
var paddleX = canvas.width/2;
var upPressed = false;
var downPressed = false;
var rightPressed = false;
var leftPressed = false;
var lastCalledTime;
var fps;
var paddlespeed = 8;
var jumping = false;
var jumpSpeed = 0;
var BlockList = [-1]
var blockstuff = false;
var bhj=0

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode === 38) {
        upPressed = true;
    }
	else if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode === 38) {
        upPressed = false;
    }
	else if(e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 37) {
        leftPressed = false;
    }
}

function physics()
{
	let i=0;
	while (BlockList[i]!==-1){
		if (BlockList[i].speed>0){
			if(BlockList[i].blocky < canvas.height -10+bhj){
				BlockList[i].blocky+=BlockList[i].speed;
			} else {
				BlockList[i].speed = 0;
				bhj-=4
			}
		}
		
		if((paddleY>=canvas.height-50+bhj) && (paddleY > BlockList[i].blocky-paddleHeight-jumpSpeed) && (paddleY < BlockList[i].blocky) && (paddleX > BlockList[i].blockx) && (paddleX < BlockList[i].blockx+BlockList[i].blockw)){
			alert("you lose");
			document.location.reload();
		}else if ((paddleY>=canvas.height-50+bhj) && (paddleY > BlockList[i].blocky-paddleHeight-jumpSpeed) && (paddleY < BlockList[i].blocky) && (paddleX > BlockList[i].blockx+BlockList[i].blockw+100-paddleWidth) && (paddleX < BlockList[i].blockx+BlockList[i].blockw+BlockList[i].blockw+100)){
			alert("you lose");
			document.location.reload();
		}
		
		if ((paddleY > BlockList[i].blocky-BlockList[i].blockh-paddleHeight-jumpSpeed) && (paddleY < BlockList[i].blocky+BlockList[i].blockh-paddleHeight)){
			jumpSpeed = 0;
			paddleY = BlockList[i].blocky-paddleHeight;
			jumping = false;
		}else if ((paddleY > BlockList[i].blocky-paddleHeight-jumpSpeed) && (paddleY < BlockList[i].blocky) && (paddleX > BlockList[i].blockx) && (paddleX < BlockList[i].blockx+BlockList[i].blockw)){
			jumpSpeed = 0;
			paddleY = BlockList[i].blocky+BlockList[i].blockh;
			jumpSpeed += 0.7;
		}else if ((paddleY > BlockList[i].blocky-paddleHeight-jumpSpeed) && (paddleY < BlockList[i].blocky) && (paddleX > BlockList[i].blockx+BlockList[i].blockw+100-paddleWidth) && (paddleX < BlockList[i].blockx+BlockList[i].blockw+BlockList[i].blockw+100)){
			jumpSpeed = 0;
			paddleY = BlockList[i].blocky+BlockList[i].blockh;
			jumpSpeed += 0.7;
		}
		 
		i++;
		
	}
	
	jumpSpeed+=0.7;
	paddleY += jumpSpeed;
		
	if (paddleY>canvas.height-50+bhj){
		jumping=false;
		paddleY=canvas.height-50+bhj;
	}

	setTimeout(physics, 25);
}

function jumpup(){
	jumpSpeed=-15;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballx, bally, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
	
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function bottomline() {
	ctx.beginPath();
	ctx.rect(0, canvas.height-5, canvas.width, 5)
	ctx.fillStyle = "red";
	ctx.fill();
	ctx.closePath();
}

function addBlock(){
	let block = {
		blockx:Math.floor(Math.random() * canvas.width-100) + -canvas.width+50,
		blocky:0,
		blockw:canvas.width,
		blockh:5,
		speed:2,
	}
	
	let i=0;
	while (BlockList[i]!==-1){
		i++;
	}
	BlockList[i] = block
	BlockList[i+=1]=-1;
	setTimeout(addBlock, 2000)
}

function drawblock(i){
	ctx.beginPath();
	ctx.rect(BlockList[i].blockx, BlockList[i].blocky, BlockList[i].blockw, BlockList[i].blockh);
	ctx.rect(BlockList[i].blockx+100+canvas.width, BlockList[i].blocky, BlockList[i].blockw, BlockList[i].blockh);
	ctx.fillStyle = "green";
	ctx.fill();
	ctx.closePath();
}

function drawFps() {
	if(!lastCalledTime) {
		lastCalledTime = Date.now();
		fps = 0;
		return;
	}
	delta = (Date.now() - lastCalledTime)/1000;
	lastCalledTime = Date.now();
	fps = 1/delta;
	ctx.font = "20px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("  FPS: "+fps.toFixed(0), 40, 20)
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawBall();
    drawPaddle();
	bottomline();
	drawFps();
	
	if(paddleY < 0-paddleHeight){
		alert("you win");
		document.location.reload();
	}
	
	if(blockstuff === false){
		blockstuff = true;
		addBlock();
	}
	
	if(rightPressed && paddleX < canvas.width-paddleWidth){
		paddleX += paddlespeed;
	} else if(leftPressed && paddleX > 0){
		paddleX -= paddlespeed;
	}
	if(upPressed && paddleY > 0 && jumping === false){
		jumping = true;
		jumpup();
	}

	let i=0;
	while(BlockList[i] !== -1)//BlockLoop
	{
		drawblock(i);
		i++;
	}
	
    requestAnimationFrame(draw);
}

main()
function main()
{
	physics()
	draw();
}
