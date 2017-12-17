var socket = io();
var arrMessages = [];

socket.on('connect', function () {
    var params = jQuery.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('no error!');
        }
    });
});

socket.on('disconnect', function () {
    console.log('disconnected to the server!');
});

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var text = message.text + ' ';
    var currentItem = {
        text,
        from: message.from,
        createdAt: formattedTime
    };
    arrMessages.push(currentItem);
    if (censorButton.hasClass('activated')) {
        currentItem.text = censorWords(currentItem.text).newString;
    }
    var html = Mustache.render(template, {
        text,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('updateUserList', function (users) {
    var ol = jQuery('<ol></ol>');
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

var messageTextBox = jQuery('[name=message]');

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', {
        text : messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

var censorButton = jQuery('#censor');

var uncensoredHTML;

censorButton.on('click', function() {
    censorButton.toggleClass('activated');
    if (censorButton.hasClass('activated')) {
        jQuery('div.message__body p').each(function() {
            this.innerHTML = censorWords(this.innerHTML).newString;
        });    
    } else {
        var curr = 0;
        jQuery('div.message__body p').each(function() {
            this.innerHTML = arrMessages[curr].text;
            curr += 1;
        });
    }
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