var canvas = document.getElementById('gameCanvas');

canvas.width = 800;
canvas.height = 450;

const c = canvas.getContext('2d');


function drawBackgroundColor(){

    const gradient = c.createLinearGradient(0, 0, 0, 350);

    gradient.addColorStop(0, "darkblue");
    gradient.addColorStop(1, "lightblue");

    c.fillStyle = gradient;

    c.fillRect(0, 0, canvas.width, 350);

    c.fillStyle = "green";
    c.fillRect(0, 350, canvas.width, 100);
}



const player = new Image();
player.src = 'Images/player.png';

const frame_width = 64;
const frame_height = 64;

let currentFrame = 0;
const totalFrames = 30;
let frameCounter = 0;
const frameDelay = 8;

let playerX = 100;
let playerY = 300;
const playerSpeed = 3;
const keys = [];

let velocityY = 0;
const gravity = 0.3;
const jumpForce = -10;
let isOnGround = true;
const groundY = 300;

window.addEventListener('keydown', function(e){
    keys[e.key] = true;
});

window.addEventListener('keyup', function(e){
    keys[e.key] = false;
})

function updatePlayer(){
    if(keys['ArrowRight']){
        playerX = playerX+ playerSpeed;
    }

    if(keys['ArrowLeft']){
        playerX = playerX - playerSpeed;
    }

    if(keys['ArrowUp'] && isOnGround){
        velocityY = jumpForce;
        isOnGround = false;
    }

    velocityY = velocityY +gravity;
    playerY = playerY + velocityY;

    if(playerY>=groundY){
        playerY = groundY;
        velocityY = 0;
        isOnGround = true;
    }
}

function gameLoop(){
    c.clearRect(0, 0, canvas.width, canvas.height);

    drawBackgroundColor();

    updatePlayer();

    if(keys['ArrowRight'] || keys['ArrowLeft']){

         frameCounter++;
        if(frameCounter>=frameDelay){
            currentFrame=(currentFrame+1)%totalFrames;
            frameCounter=0;
        }

    }else{
        currentFrame = 0;
    }


    c.drawImage(player, currentFrame*frame_width, 0, frame_width, frame_height, playerX, playerY, frame_width, frame_height);
    

    requestAnimationFrame(gameLoop);
}

player.onload = function(){

  gameLoop();
};
