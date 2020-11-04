const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('static_files'));

var position = {
    x: 160,
    y: 110
}

var dx = 1;
var dy = -1;

const players = {}


io.on('connection', (socket) => {
    let newPlayer = { id: socket.id, position: { ...position } };
    players[newPlayer.id] = newPlayer;

    socket.emit("connected", { newPlayer: { ...newPlayer }, players: { ...players } });
    io.emit("newPlayerConnect", { newPlayer: { ...newPlayer }, players: { ...players } });

    console.log('New Player Connected ID: ' + socket.id);

    socket.on('move', move => {
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
        socket.emit("position", { id: move.id, position: { ...players[move.id].position } });
        io.emit("update-player", players);
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
        delete players[socket.id];
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});

