var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

const leftArrow = 37;
const upArrow = 38;
const rightArrow = 39;
const downArrow = 40;

var x = canvas.width / 2;
var y = canvas.height - 30;

var upFlag = false;
var downFlag = false;
var leftFlag = false;
var rightFlag = false;

document.querySelector('body').addEventListener('keydown', function (event) {
    var tecla = event.keyCode;

    if (tecla == leftArrow) {
        leftFlag = true;
    } else if (tecla == upArrow) {
        upFlag = true;
    } else if (tecla == rightArrow) {
        rightFlag = true;
    } else if (tecla == downArrow) {
        downFlag = true;
    }
});

document.querySelector('body').addEventListener('keyup', function (event) {
    var tecla = event.keyCode;

    if (tecla == leftArrow) {
        leftFlag = false;
    } else if (tecla == upArrow) {
        upFlag = false;
    } else if (tecla == rightArrow) {
        rightFlag = false;
    } else if (tecla == downArrow) {
        downFlag = false;
    }
});


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillRect(x, y, 10, 10);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

    if (leftFlag) {
        if (x > 0) {
            socket.emit("move", 'left');
        }
    }

    if (upFlag) {
        if (y > 0) {
            socket.emit("move", 'up');
        }
    }

    if (rightFlag) {
        if (x < 290) {
            socket.emit("move", 'right');
        }
    }

    if (downFlag) {
        if (y < 140) {
            socket.emit("move", 'down');
        }
    }

}

setInterval(draw, 1);

let socket = io();

socket.on('position', param => {
    x = param.x;
    y = param.y;
})
