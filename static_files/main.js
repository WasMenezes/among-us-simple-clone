var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

const leftArrow = 37;
const upArrow = 38;
const rightArrow = 39;
const downArrow = 40;

var upFlag = false;
var downFlag = false;
var leftFlag = false;
var rightFlag = false;

let socket = io();

const players = {}

socket.on('newPlayerConnect', param => {
    players[param.id] = param;
});

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

socket.on('position', param => {
    players[param.id] = param;
})

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (const id in players) {
        if (players.hasOwnProperty(id)) {
            const element = players[id];
            ctx.fillRect(element.position.x, element.position.y, 10, 10);
        }
    }
    
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