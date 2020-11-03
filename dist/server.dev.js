"use strict";

var express = require('express');

var app = express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(express["static"]('static_files'));
var position = {
  x: 160,
  y: 110
};
var dx = 1;
var dy = -1;
io.on('connection', function (socket) {
  socket.emit("position", position);
  socket.on('move', function (move) {
    switch (move) {
      case 'up':
        position.y += dy;
        socket.emit("position", position);
        break;

      case 'left':
        position.x -= dx;
        socket.emit("position", position);
        break;

      case 'down':
        position.y -= dy;
        socket.emit("position", position);
        break;

      case 'right':
        position.x += dx;
        socket.emit("position", position);
        break;
    }
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
http.listen(3000, function () {
  console.log('listening on *:3000');
});