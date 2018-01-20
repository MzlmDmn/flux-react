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

        // Valider la longueur du mot de passe et que les deux mots de passes sont pareils.
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
            from: '***REMOVED***', // sender address
            to: mail, // list of receivers
            subject: 'Bienvenue sur Flux App, ' + username, // Subject line
            html: '<h1>Bienvenue sur Flux App, '+ username +'</h1><p>Veuillez activer votre compte en cliquant sur le lien suivant: <a href="http://localhost:3000/mail/'+ hashcode +'">Lien d\'activation</a></p>'
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
                console.log('Erreur lors de l\'envoi du mail d\'activation')
            else
                console.log(info);
        });
    },

    // Vérifier l'existence de l'Username/Mail dans la DB

    checkUserExist(username, mail){

        return new Promise ((resolve, reject) => {

            Promise.all([database.getUserByUsername(username), database.getUserByMail(mail)]).then(function(values) {
                console.dir(values);
                /*
                if(values[0] === undefined && values[1] === undefined){
                    console.log('Username or Mail doesn\'t exist');
                    resolve(true);

                } else {
                    console.log('Username or Mail does exist');
                    reject('User or mail exist');
                }*/
            });
        });
    }

};

