const express = require('express');
    app = express();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = {};

    // Routing
app.use(express.static('public'));

// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function(socket){
    socket.on('new user', function(data, callback){  
        if (data in users){
            callback(false);
        } else {            
            socket.nickName = data;
            users[socket.nickName] = socket;
            callback(true);
            updateNickNames();     
        }
    });

    function updateNickNames() {
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('chat message', function(data){
        console.log(socket.nickName + ' : ' + data);
        io.sockets.emit('chat message', {msg: data, nick: socket.nickName});
    });

    socket.on('disconnect', function(){
        if(!socket.nickName) return;
        delete users[socket.nickName];
        updateNickNames();
    });

});

// http.listen(port, function(){
//     console.log('listening on *:5000');
// });

server.listen(process.env.PORT || 5000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
