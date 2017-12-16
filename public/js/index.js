var socket = io();

socket.on('connect', function () {
    console.log('connected to server!');
    socket.emit('createMessage', {
        from: 'me',
        text: 'Yup'
    });
});

socket.on('disconnect', function () {
    console.log('disconnected to the server!');
});

socket.on('newMessage', function (message) {
    console.log(message);
});

