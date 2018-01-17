const server = require('http').Server();
const io = require('socket.io')(server);
const cryptojs = require('crypto-js');

const Channel = require('./Class/Channel.js');
const User = require('./Class/User.js');

const database = require('./db.js');

io.on('connection', function(socket){
    console.log('A user connected');


    // Authentification de l'utilisateur
    socket.on('connect_auth', (data) => {
        socket.username = data.username;
        console.log('connect_auth: ' + socket.username);
    });

    // Initialisation lorsque l'utilisateur rejoint un Channel
    socket.on('connect_message', (data) => {

        // Si l'utilisateur est déjà connecté à un Channel, on le quitte
        let prevChannel = socket.channel;
        if(socket.channel){ socket.leave(prevChannel); }

        // Et on réattribue socket.channel à la nouvelle route
        socket.channel = data.channel;

        // On récupère les informations de la chaîne et on les envoi à l'utilisateur

        database.getChannelByName(socket.channel).then(function(rows) {
            if(rows !== undefined) {
                // On crée une instance de Channel sur le socket
                socket.channel_obj = new Channel(rows.id, rows.name, rows.permaname, rows.title, rows.description, rows.image, rows.owner, rows.mods, rows.created_at);
                console.dir(socket.channel_obj);
                // Et on envoi l'objet Channel à l'utilisateur
                socket.emit('channel_info', socket.channel_obj);
                // On rejoint le Channel
                socket.join(socket.channel);
                console.log(socket.username + ' has joined on channel ' + socket.channel + ' / ' + data.message);
            } else {
                // Informer l'utilisateur que le Channel n'existe pas
                socket.emit('channel_info', { error: 'notfound'});
            }
        }).catch((err) => setImmediate(() => { throw err; }));
    });

    // Opération lorsque l'utilisateur envoi un message sur un channel
    socket.on('message', (data) =>{
        console.log(data.from + '-' + socket.id + ' #' + data.on + ' : ' + data.msg);
        io.to(socket.channel).send({username: data.from, message: data.msg});
    });

    socket.on('edit_channel', (data) =>{
        // On vérifie que l'utilisateur qui fait la demande est bien le propriétaire du Channel
        if(socket.channel_obj.owner === socket.username){
            database.updateChannel(socket.channel_obj.id, data.title, data.description, data.image);
            database.getChannelByName(socket.channel).then(function(rows) {
                if(rows) {
                    // On crée une instance de Channel sur le socket
                    socket.channel_obj = new Channel(rows.id, rows.name, rows.permaname, rows.title, rows.description, rows.image, rows.owner, rows.mods, rows.created_at);
                    console.dir(socket.channel_obj);
                    // Et on envoi l'objet Channel à tout le monde pour les remettre à jour
                    io.to(socket.channel_obj.permaname).send('channel_info', socket.channel_obj);
                    console.log('Channel info updated to everyone in channel ' + socket.channel_obj.permaname);
                } else {
                    socket.emit('channel_info', { error: 'notfound'});
                }
            }).catch((err) => setImmediate(() => { throw err; }));
            console.log('database_channel_update');
        }
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

database.getUserByName('MaZluM').then(function(rows){
    if(rows !== undefined){
        console.dir(rows);
        let bytes = cryptojs.AES.decrypt(rows.password.toString(), 'Ma phrase secrète');
        let decryptedpwd = bytes.toString(cryptojs.enc.Utf8);
        console.log(decryptedpwd);
    } else{
        console.log('Existe pas');
    }
});

server.listen(8000, function(){
    console.log('Listening on 8000');
});