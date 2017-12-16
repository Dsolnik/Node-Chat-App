const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

server.listen(PORT, () => {
    console.log(`server is up on port ${PORT}`)
});

io.on('connection', (socket) => {
    console.log('New User Connected!');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat Room!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new User has joined!'));

    socket.on('createMessage', (message, cb) => {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        cb('this is from the server!');
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

});