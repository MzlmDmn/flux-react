const server = require('http').Server();
const io = require('socket.io')(server);

const Channel = require('./Class/Channel.js');

const database = require('./db.js');

io.on('connection', function(socket){
    console.log('A user connected');

    socket.on('connect_auth', (data) => {
        socket.username = data.username;
        console.log('connect_auth: ' + socket.username);
    });

    socket.on('connect_message', (data) => {

        // Si l'utilisateur est déjà connecté à un Channel, on le quitte
        let prevChannel = socket.channel;
        if(socket.channel){ socket.leave(prevChannel); }

        // Et on réattribue socket.channel à la nouvelle route
        socket.channel = data.channel;

        // On récupère les informations de la chaîne et on les envoi à l'utilisateur

        database.getChannelByName(socket.channel).then(function(rows) {
            if(rows) {
                // On crée une instance de Channel sur le socket
                socket.channel_obj = new Channel(rows.id, rows.name, rows.permaname, rows.title, rows.description, rows.image, rows.owner, rows.mods, rows.created_at);
                console.dir(socket.channel_obj);
                console.log(socket.channel_obj.getName());
                // Et on envoi l'objet Channel à l'utilisateur
                socket.emit('channel_info', socket.channel_obj);
            } else {
                // Informer l'utilisateur que le Channel n'existe pas
                socket.emit('channel_info', { error: 'notfound'});
            }
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

// updateChannel('3', 'On meurt', 'Bienvenue sur cette page exceptionnelle', '/img/uploads/mazlumchannel.png');

// deleteChannelById(4); // deleteChannelByName('mazlumchannel');

// getChannels();

// console.log(functions.getChannelByName('mazlumchannel'))

server.listen(8000, function(){
    console.log('Listening on 8000');
});