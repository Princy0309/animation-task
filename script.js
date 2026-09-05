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

drawBackgroundColor();
