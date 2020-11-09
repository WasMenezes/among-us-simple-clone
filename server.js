const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('static_files'));

var position = {
    x: 160,
    y: 110
}

var dx = 0.25;
var dy = -0.25;

let players = {}

const cycleLoop = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

io.on('connection', (socket) => {
    let newPlayer = { id: socket.id, position: { ...position }, currentLoopIndex: 11};
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
        players[move.id].currentLoopIndex++;
        if (players[move.id].currentLoopIndex >= cycleLoop.length) {
            players[move.id].currentLoopIndex = 0;
        }

        socket.emit("position", { id: move.id, position: { ...players[move.id].position }, currentLoopIndex:  players[move.id].currentLoopIndex});
        io.emit("update-player", players);
    })   

    socket.on('stop-player', playerId => {
        players[playerId].currentLoopIndex = 11;
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

