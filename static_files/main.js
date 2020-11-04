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

var playerId;

let socket = io();

let players = {}

socket.on('newPlayerConnect', param => {
    players[param.id] = param.newPlayer;
    players = param.players;
});

socket.on('connected', param => {
    playerId = param.newPlayer.id
    players[param.newPlayer.id] = param.newPlayer;
    players = param.players;
})

document.querySelector('body').addEventListener('keydown', function (event) {
    var tecla = event.keyCode;

    switch (tecla) {
        case leftArrow:
            leftFlag = true;
            break;
        case upArrow:
            upFlag = true;
            break;
        case rightArrow:
            rightFlag = true;
            break;
        case downArrow:
            downFlag = true;
            break;
    }
});

document.querySelector('body').addEventListener('keyup', function (event) {
    var tecla = event.keyCode;

    switch (tecla) {
        case leftArrow:
            leftFlag = false;
            break;
        case upArrow:
            upFlag = false;
            break;
        case rightArrow:
            rightFlag = false;
            break;
        case downArrow:
            downFlag = false;
            break;
    }
});

socket.on('position', param => {
    players[param.id].position = param.position;
})

socket.on('update-player', param => {
    players = param;
})

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    for (const id in players) {
        if (players.hasOwnProperty(id)) {
            const element = players[id];
            ctx.fillRect(element.position.x, element.position.y, 10, 10);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
        }
    }
    ctx.closePath();

    if (leftFlag) {
        if (players[playerId].position.x > 0) {
            socket.emit("move", { position: 'left', id: playerId });
        }
    }

    if (upFlag) {
        if (players[playerId].position.y > 0) {
            socket.emit("move", { position: 'up', id: playerId });
        }
    }

    if (rightFlag) {
        if (players[playerId].position.x < 290) {
            socket.emit("move", { position: 'right', id: playerId });
        }
    }

    if (downFlag) {
        if (players[playerId].position.y < 140) {
            socket.emit("move", { position: 'down', id: playerId });
        }
    }
}

setInterval(draw, 1);