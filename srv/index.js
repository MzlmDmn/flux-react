const server = require('http').Server();
const io = require('socket.io')(server);

const database = require('./db.js');

io.on('connection', function(socket){
    console.log('A user connected');

    socket.on('connect_auth', (data) => {
        socket.username = data.username;
        console.log('connect_auth: ' + socket.username);
    });

    socket.on('connect_message', (data) => {
        socket.channel = data.channel;

        // On récupère les informations de la chaîne et on les envoi au visiteur

        database.getChannelByName(socket.channel).then(function(rows) {
            console.log(rows);
            socket.emit('channel_info', rows);
        }).catch((err) => setImmediate(() => { throw err; }));

        socket.join(socket.channel);
        console.log(socket.username + ' has joined on channel ' + socket.channel + ' / ' + data.message);

    });

    socket.on('message', (data) =>{
        console.log(data.from + '-' + socket.id + ' #' + data.on + ' : ' + data.msg);

        io.to(data.on).send({username: data.from, message: data.msg});
    });

    socket.on('disconnect', (reason) => {
        console.log('A user disconnected')
    })
});

// Tous les sockets
// io.sockets.send({username: data.from, message: data.msg});

// Tous les sockets dans le channel 'to'
// io.to(data.on).send({username: data.from, message: data.msg});


// createChannel('MazlumChannel', 'On s\'amuse!', 'Bienvenue sur cette page exceptionnelle', '/img/uploads/mazlumchannel.png', 'Mazlum');

// updateChannel('3', 'On meurt', 'Bienvenue sur cette page exceptionnelle', '/img/uploads/mazlumchannel.png');

// deleteChannelById(4); // deleteChannelByName('mazlumchannel');

// getChannels();



// console.log(functions.getChannelByName('mazlumchannel'))

server.listen(8000, function(){
    console.log('Listening on 8000');
});