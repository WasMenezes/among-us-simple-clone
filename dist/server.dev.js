"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var app = express();

var http = require('http').createServer(app);

var io = require('socket.io')(http);

app.use(express["static"]('static_files'));
var position = {
  x: 160,
  y: 110
};
var dx = 0.25;
var dy = -0.25;
var players = {};
var cycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
io.on('connection', function (socket) {
  var newPlayer = {
    id: socket.id,
    position: _objectSpread({}, position),
    currentLoopIndex: 11
  };
  players[newPlayer.id] = newPlayer;
  socket.emit("connected", {
    newPlayer: _objectSpread({}, newPlayer),
    players: _objectSpread({}, players)
  });
  io.emit("newPlayerConnect", {
    newPlayer: _objectSpread({}, newPlayer),
    players: _objectSpread({}, players)
  });
  console.log('New Player Connected ID: ' + socket.id);
  socket.on('move', function (move) {
    switch (move.position) {
      case 'up':
        players[move.id].position.y += dy;
        break;

      case 'left':
        players[move.id].position.x -= dx;
        break;

      case 'down':
        players[move.id].position.y -= dy;
        break;

      case 'right':
        players[move.id].position.x += dx;
        break;
    }

    players[move.id].currentLoopIndex++;

    if (players[move.id].currentLoopIndex >= cycleLoop.length) {
      players[move.id].currentLoopIndex = 0;
    }

    socket.emit("position", {
      id: move.id,
      position: _objectSpread({}, players[move.id].position),
      currentLoopIndex: players[move.id].currentLoopIndex
    });
    io.emit("update-player", players);
  });
  socket.on('stop-player', function (playerId) {
    players[playerId].currentLoopIndex = 11;
    io.emit("update-player", players);
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
    delete players[socket.id];
  });
});
http.listen(3000, function () {
  console.log('listening on *:3000');
});