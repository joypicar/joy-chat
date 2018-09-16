const express = require('express');
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    nickNames = [];

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if (nickNames.indexOf(data) != -1){
            callback(false);
        } else {
            callback(true);
            socket.nickName = data;
            nickNames.push(socket.nickName);            
        }
    });

    function updateNickNames() {
        io.sockets.emit('usernames', nickNames);
    }

    socket.on('chat message', function(data){
        console.log(socket.nickName + ' : ' + data);
        io.sockets.emit('chat message', {msg: data, nick: socket.nickName});
    });
});

// http.listen(port, function(){
//     console.log('listening on *:5000');
// });

server.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
