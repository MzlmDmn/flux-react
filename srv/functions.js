const cryptojs = require('crypto-js');
const database = require('./db.js');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '###',
        pass: '###'
    }
});

module.exports = {

    validateUser : function(username, password, mail){
        let user_reg = /^[a-zA-Z0-9]+$/;
        let mail_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Valider l'username avec Regex azAZ09 et la longueur
        if(!user_reg.test(username) || username.length <= 5){
            return false;
        }

        // Valider la longueur du mot de passe et que les deux mots de passes sont similaires.
        if(password.length <= 7){
            return false;
        }

        // Valider l'email avec Regex
        if(!mail_reg.test(mail.toLowerCase())){
            return false;
        }

        return true;

    },

    sendMail(username, mail, hashcode){
        const mailOptions = {
            from: '###', // Adresse d'envoi
            to: mail, // Liste des destinataires
            subject: 'Bienvenue sur Flux App, ' + username, // Sujet du message
            html: '<h1>Bienvenue sur Flux App, '+ username +'</h1><p>Veuillez activer votre compte en cliquant sur le lien suivant: <a href="http://localhost:3000/mail/'+ hashcode +'">Lien d\'activation</a></p>' // HTML du message
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
                console.log('Erreur lors de l\'envoi du mail d\'activation')
            else
                console.log(info);
        });
    },

    sendUserInfo(socket){
        let userHistory = socket.user.history;
        let newHistory = [];

        // Convertir l'historique de l'utilisateur en objet Channels
         setTimeout(()=>{
            database.getActiveChannels().then((rows) => {
                for(let history of userHistory){
                    for(let channel of rows){
                        if(history === channel.permaname){
                            newHistory.push(channel);
                        }
                    }
                }

                socket.emit('user_info', {
                    username: socket.user.username,
                    mail: socket.user.mail,
                    bio: socket.user.bio,
                    image: socket.user.image,
                    history: newHistory.reverse(),
                    role: socket.user.role,
                    created_at: socket.user.created_at
                });
            });
        }, 2000);


    },

    addChannelHistory(socket, channel){

        // Vérifier qu'il n'y a pas de vide dans l'array
        let temp = [];
        for(let i of socket.user.history)
            i && temp.push(i); // copy each non-empty value to the 'temp' array

        socket.user.history = temp;

        let historyIndex = socket.user.history.indexOf(channel);

        // Supprimer le Channel de l'historique si il existe, pour le remettre en haut de la liste
        if(historyIndex > -1){
            socket.user.history.splice(historyIndex, 1);
        }
        socket.user.history.push(channel);

        setTimeout(()=>{
            database.updateUserHistory(socket.user.id, socket.user.history);
        }, 1000);
        this.sendUserInfo(socket);
    }



};

