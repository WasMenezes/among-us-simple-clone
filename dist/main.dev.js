"use strict";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
var leftArrow = 37;
var upArrow = 38;
var rightArrow = 39;
var downArrow = 40;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 1;
var dy = -1;
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
      x -= dx;
    }
  }

  if (upFlag) {
    if (y > 0) {
      y += dy;
    }
  }

  if (rightFlag) {
    if (x < 290) {
      x += dx;
    }
  }

  if (downFlag) {
    if (y < 140) {
      y -= dy;
    }
  }
}

setInterval(draw, 1);