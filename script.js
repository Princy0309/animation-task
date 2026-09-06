var canvas = document.getElementById('gameCanvas');

canvas.width = 800;
canvas.height = 450;

const c = canvas.getContext('2d');


function drawBackgroundColor(){

    const gradient = c.createLinearGradient(0, 0, 0, 350);

    gradient.addColorStop(0, '#0f0c29');     
    gradient.addColorStop(0.5, '#302b63');   
    gradient.addColorStop(1, '#24243e');

    c.fillStyle = gradient;

    c.fillRect(0, 0, canvas.width, 350);

    c.fillStyle = "green";
    c.fillRect(0, 350, canvas.width, 100);
}

let cloudX1 = 150;
let cloudX2 = 400;
let cloudX3 = 750;

function drawClouds(){

    cloudX1 = cloudX1+0.2;
    cloudX2 = cloudX2+0.2;
    cloudX3 = cloudX3 +0.2;

    if (cloudX1 > canvas.width + 50) cloudX1=-100;
    if (cloudX2 > canvas.width + 50) cloudX2=-100;
    if (cloudX3 > canvas.width + 50) cloudX3 = -100;

    c.fillStyle = 'rgba(255, 255, 255, 0.6)';

    c.beginPath();
    c.arc(cloudX1, 80, 25, 0, Math.PI * 2);
    c.arc(cloudX1+30, 75, 30, 0, Math.PI * 2);
    c.arc(cloudX1+60, 80, 25, 0, Math.PI * 2);
    c.fill();


    c.beginPath();
    c.arc(cloudX2, 50, 20, 0, Math.PI*2);
    c.arc(cloudX2+25, 45, 28, 0, Math.PI * 2 );
    c.arc(cloudX2+55, 50, 22, 0, Math.PI * 2);
    c.fill();

    c.beginPath();
    c.arc(cloudX3, 50, 22, 0, Math.PI*2);
    c.arc(cloudX3+25, 45, 28, 0, Math.PI*2);
    c.arc(cloudX3+65, 50, 22, 0, Math.PI*2);
    c.fill();
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
const keys = {};

let velocityY = 0;
const gravity = 0.3;
const jumpForce = -10;
let isOnGround = true;
const groundY = 316;

const platforms = [
    {x: 0, y: 380, width: 800, height: 70}, 
    {x:150, y:290, width: 120, height: 15},
    {x: 400, y: 220, width: 120, height: 15},
    {x: 250, y: 150, width: 120, height:15},
]



let score = 0;
const coins = [
    {x:200, y:350, size: 10, collected: false},
    {x:400, y:350, size:20, collected:false},
    {x:600, y:350, size:10, collected:false},
    {x:190, y:260, size:10, collected:false},
    {x:440, y:190, size:10, collected:false},
    {x:290, y:120, size:10, collected:false},
]


let gameOver = false;
const obstacles =[
    {x:300, y:365, width:20, height: 15, speed:1, minX:200, maxX:500},
    {x:420, y:205, width:20, height:15, speed:0.8, minX:400, maxX:510},
]


function drawObtacles(){
    obstacles.forEach(function(obs){
        obs.x = obs.x + obs.speed;
        if(obs.x<=obs.minX || obs.x+obs.width > obs.maxX){
            obs.speed = -obs.speed;
        } 


        c.fillStyle = '#44cc44';
        c.beginPath();
        c.arc(obs.x+10, obs.y+5, 12, Math.PI, 0);
        c.fillRect(obs.x-2, obs.y+5, 24, 10);
        c.fill();

        c.fillStyle = 'white';
        c.beginPath();
        c.arc(obs.x + 5, obs.y + 2, 4, 0, Math.PI * 2);
        c.arc(obs.x + 15, obs.y + 2, 4, 0, Math.PI * 2);
        c.fill();


        c.fillStyle = 'black';
        c.beginPath();
        c.arc(obs.x + 6, obs.y + 3, 2, 0, Math.PI * 2);
        c.arc(obs.x + 16, obs.y + 3, 2, 0, Math.PI * 2);
        c.fill();
    })
}



function drawCoins(){
    coins.forEach(function(coin){
        if(coin.collected) return;


        c.fillStyle = '#FFD700';
        c.beginPath();
        c.arc(coin.x, coin.y, coin.size, 0, Math.PI*2);
        c.fill();


        c.fillStyle='#FFF8DC';
        c.beginPath();
        c.arc(coin.x-3, coin.y-3, coin.size/3, 0, Math.PI*2);
        c.fill();
    });
}



function checkCoinTouched(){
    coins.forEach(function(coin){
        if(coin.collected) return;


        var playerCenterX = playerX + frame_width/2;
        var playerCenterY = playerY + frame_height/2;

        var dx = playerCenterX - coin.x;
        var dy = playerCenterY - coin.y;

        var distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < coin.size +20){
            coin.collected = true;
            score++;
        }
    })
}

function drawPlatforms() {
    platforms.forEach(function(plat, index) {
        if (index === 0) {
            c.fillStyle = '#2d5a1e';
            c.fillRect(plat.x, plat.y, plat.width, plat.height);
        } else {
            c.fillStyle = '#5a3a1e';
            c.fillRect(plat.x, plat.y, plat.width, plat.height);
            c.fillStyle = '#7a5a3e';
            c.fillRect(plat.x, plat.y, plat.width, 4);
        }
    });
}

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

    if(playerX < 0) playerX = 0;
    if(playerX + frame_width > canvas.width) playerX = canvas.width-frame_width;
    if(playerY < 0) playerY = 0;

    velocityY = velocityY +gravity;
    playerY = playerY + velocityY;
    isOnGround=false;

    platforms.forEach(function(plat){
        if(
            playerX+frame_width > plat.x &&
            playerX < plat.x + plat.width &&
            playerY + frame_height >= plat.y &&
            playerY + frame_height <= plat.y + plat.height + velocityY &&
            velocityY >= 0
        ){
            playerY = plat.y - frame_height;
            velocityY = 0;
            isOnGround = true;
        }
    });

    if(playerY>=groundY){
        playerY = groundY;
        velocityY = 0;
        isOnGround = true;
    }
}

function gameLoop(){
    c.clearRect(0, 0, canvas.width, canvas.height);

    drawBackgroundColor();

    drawClouds();

    drawPlatforms();

    updatePlayer();

    checkCoinTouched();
    drawObtacles();
    drawCoins();

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

    c.font = 'bold 18px Arial';
    c.fillStyle = 'white';
    c.fillText('Super Sprite Boy', 10, 25);

    c.font = '12px Arial';
    c.fillStyle = 'rgba(255,255,255,0.6)';
    c.fillText('Arrow keys to move, Up to jump', 10, 442);

    c.font = 'bold 20px Arial';
   c.fillStyle = '#FFD700';
   c.fillText('Coins: ' + score + ' / ' + coins.length, canvas.width - 150, 25);

    

    requestAnimationFrame(gameLoop);
}

player.onload = function(){

  gameLoop();

};


