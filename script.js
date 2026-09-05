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

player.onload = function(){

    drawBackgroundColor();
    c.drawImage(player, 0, 0, frame_width, frame_height, 100, 300, frame_width, frame_height);

};
