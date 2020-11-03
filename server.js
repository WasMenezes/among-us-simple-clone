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

const players = {

}


io.on('connection', (socket) => {
    socket.emit("newPlayerConnect", { id: socket.id, position: {...position} });
    console.log('New Player Connected ID: ' + socket.id);

    socket.on('move', move => {
        switch (move) {
            case 'up':
                position.y += dy;
                socket.emit("position", { id: socket.id, position: {...position} });
                break;
            case 'left':
                position.x -= dx;
                socket.emit("position", { id: socket.id, position: {...position} });
                break;
            case 'down':
                position.y -= dy;
                socket.emit("position", { id: socket.id, position: {...position} });
                break;
            case 'right':
                position.x += dx;
                socket.emit("position", { id: socket.id, position: {...position} });
                break;
        }
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});

