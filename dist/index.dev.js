"use strict";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
document.querySelector('body').addEventListener('keydown', function (event) {
  var tecla = event.keyCode;

  if (tecla == 37) {
    // seta pra ESQUERDA
    if (x > 0) {
      x -= dx;
    }
  } else if (tecla == 38) {
    // seta pra CIMA
    if (y > 0) {
      y += dy;
    }
  } else if (tecla == 39) {
    // seta pra DIREITA
    if (x < 290) {
      x += dx;
    }
  } else if (tecla == 40) {
    // seta pra Baixo
    if (y < 140) {
      y -= dy;
    }
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.fillRect(x, y, 10, 10);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
  console.log(x, y);
}

setInterval(draw, 1);
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 10;
var dy = -10;