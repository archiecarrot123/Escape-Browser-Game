var canvas = document.getElementById("canvas");
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var ballx = Math.floor(Math.random() * canvas.width / 2) + canvas.width / 2 / 2;
var bally = Math.floor(Math.random() * canvas.height / 2) + canvas.height / 2 / 2;
var dx = 5;
var dy = -5;
var paddleHeight = Math.floor(canvas.width / 40);
var paddleWidth = paddleHeight;
var paddleY = canvas.height - paddleHeight + 10;
var paddleX = canvas.width / 2;
var upPressed = false;
var downPressed = false;
var rightPressed = false;
var leftPressed = false;
var lastCalledTime;
var upsLastCalledTime;
var fps;
var ups;
var paddlespeed = Math.floor(canvas.width / 100);
var jumping = false;
var jumpSpeed = 0;
var BlockList = [-1]
var blockThreshold = Math.floor(canvas.height / 8);
var blockCounter = blockThreshold;
var blockSpeed = canvas.height / 500
var bhj = -5
var blockSize = Math.floor(canvas.width / 10);
var blockHeight = 5;
var jumpHeight = -Math.sqrt(canvas.height / 2);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode === 38) {
        upPressed = true;
    } else if (e.keyCode === 39) {
        rightPressed = true;
    } else if (e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode === 38) {
        upPressed = false;
    } else if (e.keyCode === 39) {
        rightPressed = false;
    } else if (e.keyCode === 37) {
        leftPressed = false;
    }
}

function physics() {
    let i = 0;
    while (BlockList[i] !== -1) {
        if (BlockList[i].speed > 0) {
            if (BlockList[i].blocky < canvas.height - blockHeight + bhj) {
                BlockList[i].blocky += BlockList[i].speed;
            } else {
                BlockList[i].speed = 0;
                bhj = BlockList[i].blocky - canvas.height
            }
        }
        if (BlockList[i].speed !== 0 && BlockList[i].blocky < canvas.height - BlockList[i].speed + bhj) {
            // *3/4 to give it some tolerance so it stops killing the player at the wrong time
                if ((paddleY >= canvas.height - paddleHeight + bhj) && (paddleY > BlockList[i].blocky - paddleHeight * 3 / 4 + BlockList[i].speed) && (paddleY < BlockList[i].blocky - jumpSpeed) && !((paddleX > BlockList[i].blockx + BlockList[i].blockw) && (paddleX + paddleWidth < BlockList[i].blockx + BlockList[i].blockw + blockSize))) {
//                     alert("you lose (check 1)  from block " + i + "  blocky=" + BlockList[i].blocky + " jumpSpeed=" + jumpSpeed + (paddleY >= canvas.height - paddleHeight + bhj) + (paddleY > BlockList[i].blocky - paddleHeight + BlockList[i].speed) + (paddleY < BlockList[i].blocky - jumpSpeed) + !((paddleX > BlockList[i].blockx + BlockList[i].blockw) && (paddleX + paddleWidth < BlockList[i].blockx + BlockList[i].blockw + blockSize)));
                    alert("you lose");
                    document.location.reload();
                    // don't think this check below does anything useful
//                 } else if ((paddleY >= canvas.height - paddleHeight + bhj) && (paddleY > BlockList[i].blocky - paddleHeight) && (paddleY < BlockList[i].blocky - jumpSpeed) && !((paddleX > BlockList[i].blockx + BlockList[i].blockw) && (paddleX + paddleWidth < BlockList[i].blockx + BlockList[i].blockw + blockSize))) {
//                     alert("you lose");
//                     document.location.reload();
                }
        }
        // jumping code
        if ((paddleY > BlockList[i].blocky - BlockList[i].blockh - paddleHeight - jumpSpeed) && (paddleY < BlockList[i].blocky + BlockList[i].blockh - paddleHeight) && !((paddleX > BlockList[i].blockx + BlockList[i].blockw) && (paddleX + paddleWidth < BlockList[i].blockx + BlockList[i].blockw + blockSize))) {
            jumpSpeed = 0;
            paddleY = BlockList[i].blocky - paddleHeight;
            jumping = false;
        } else if ((paddleY > BlockList[i].blocky - paddleHeight) && (paddleY < BlockList[i].blocky - jumpSpeed) && (paddleX > BlockList[i].blockx) && (paddleX < BlockList[i].blockx + BlockList[i].blockw)) {
            jumpSpeed = 0;
            paddleY = BlockList[i].blocky + BlockList[i].blockh;
            jumpSpeed += 0.7;
        } else if ((paddleY > BlockList[i].blocky - paddleHeight) && (paddleY < BlockList[i].blocky - jumpSpeed) && (paddleX > BlockList[i].blockx + BlockList[i].blockw + blockSize - paddleWidth) && (paddleX < BlockList[i].blockx + BlockList[i].blockw + BlockList[i].blockw + blockSize)) {
            jumpSpeed = 0;
            paddleY = BlockList[i].blocky + BlockList[i].blockh;
            jumpSpeed += 0.7;
        }

        i++;

    }

    jumpSpeed += 0.7;
    paddleY += jumpSpeed;

    if (paddleY > canvas.height - paddleHeight + bhj) {
        jumping = false;
        jumpSpeed = 0
        paddleY = canvas.height - paddleHeight + bhj;
    }
    
    blockCounter++
    
    if (blockCounter >= blockThreshold) {
        blockCounter = 0
        addBlock()
    }
    
    noteUps();

    setTimeout(physics, 25);
}

function jumpup() {
    jumpSpeed = jumpHeight;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballx, bally, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    if (jumping === true) {
        ctx.fillStyle = "cyan";
    } else {
        ctx.fillStyle = "blue";
    }
    ctx.fill();
    ctx.closePath();
}

function bottomline() {
    ctx.beginPath();
    ctx.rect(0, canvas.height - 5, canvas.width, 5)
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
}

function addBlock() {
    let block = {
        blockx: Math.floor(Math.random() * canvas.width - blockSize) + -canvas.width + blockSize/2,
        blocky: 0,
        blockw: canvas.width,
        blockh: blockHeight,
        speed: blockSpeed,
    }

    let i = 0;
    while (BlockList[i] !== -1) {
        i++;
    }
    BlockList[i] = block
    BlockList[i += 1] = -1;
}

function drawblock(i) {
    ctx.beginPath();
    ctx.rect(BlockList[i].blockx, BlockList[i].blocky, BlockList[i].blockw, BlockList[i].blockh);
    ctx.rect(BlockList[i].blockx + blockSize + canvas.width, BlockList[i].blocky, BlockList[i].blockw, BlockList[i].blockh);
    if (BlockList[i].blocky < canvas.height - BlockList[i].speed * 2 + bhj) {
        ctx.fillStyle = "green";
    } else {
        ctx.fillStyle = "yellow";
    }
    ctx.fill();
    ctx.closePath();
}

function drawFps() {
    if (!lastCalledTime) {
        lastCalledTime = Date.now();
        fps = 0;
        return;
    }
    delta = (Date.now() - lastCalledTime) / 1000;
    lastCalledTime = Date.now();
    fps = 1 / delta;
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("  FPS: " + fps.toFixed(0), 40, 20)
    ctx.fillText("  UPS: " + ups.toFixed(0), 40, 40)
//     ctx.fillText("  bhj: " + bhj.toFixed(0), 40, 60)
//     ctx.fillText("  debug1: " + (paddleY >= canvas.height - paddleHeight + bhj) + (paddleY > BlockList[1].blocky - paddleHeight + BlockList[1].speed) + (paddleY < BlockList[1].blocky - jumpSpeed) + !((paddleX > BlockList[1].blockx + BlockList[1].blockw) && (paddleX + paddleWidth < BlockList[1].blockx + BlockList[1].blockw + blockSize)), 40, 80)
//     ctx.fillText("  debug2: " + Math.round(paddleY * 100) / 100 + ">" + Math.round(BlockList[1].blocky * 100) / 100 + "-" + Math.round(paddleHeight * 75) / 100 + "+" + BlockList[1].speed, 40, 100)
}

function noteUps() {
    if (!upsLastCalledTime) {
        upsLastCalledTime = Date.now();
        ups = 0;
        return;
    }
    delta = (Date.now() - upsLastCalledTime) / 1000;
    upsLastCalledTime = Date.now();
    ups = 1 / delta;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawBall();
    drawPaddle();
    bottomline();
    drawFps();

    if (paddleY < 0 - paddleHeight) {
        alert("you win");
        document.location.reload();
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddlespeed;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= paddlespeed;
    }
    if (upPressed && paddleY > 0 && jumping === false) {
        jumping = true;
        jumpup();
    }

    let i = 0;
    while (BlockList[i] !== -1) //BlockLoop
    {
        drawblock(i);
        i++;
    }

     setTimeout(function(){ requestAnimationFrame(draw); }, 16);
}

main()

function main() {
    physics()
    draw();
}
