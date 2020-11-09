var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

let img = new Image();
img.src = './assets/among-us-walking-spritesheet.png';
const scale = 0.18;
const width = 84;
const height = 110;
const scaledWidth = scale * width;
const scaledHeight = scale * height;
const cycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let currentLoopIndex = 0;

function init() {
    window.requestAnimationFrame(step);
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * width, frameY * height, width, height,
        canvasX, canvasY, scaledWidth, scaledHeight);
}

img.onload = function () {
    init();
};

let frameCount = 0;

function step() {
    frameCount++;
    if (frameCount < 3) {
        window.requestAnimationFrame(step);
        return;
    }
    frameCount = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const id in players) {
        if (players.hasOwnProperty(id)) {
            const element = players[id];
            drawFrame(cycleLoop[element.currentLoopIndex], 0, element.position.x, element.position.y);
        }
    }
    window.requestAnimationFrame(step);
}

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

    if (!leftFlag && !upFlag && !rightFlag && !downFlag) {
        socket.emit('stop-player', playerId);
    }
});

socket.on('position', param => {
    players[param.id].position = param.position;
    players[param.id].currentLoopIndex = param.currentLoopIndex;
})

socket.on('update-player', param => {
    players = param;
})


function control() {
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

setInterval(control, 1);