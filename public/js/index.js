var socket = io();

socket.on('connect', function () {
    console.log('connected to server!');
});

socket.on('disconnect', function () {
    console.log('disconnected to the server!');
});

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');

    var li = jQuery('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);
    jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
    var li = jQuery('<li></li>');
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var a = jQuery('<a target="_blank"> My Current Location</a>');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});

var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        from : 'User',
        text : messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {

    if (!navigator.geolocation) return alert('Geolocation not supported by your browser!');

    locationButton.attr('disabled', 'disabled').text('Sending Location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude, 
            longitude: position.coords.longitude});
    }, function(error) {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('unable to fetch location!');
    });
});