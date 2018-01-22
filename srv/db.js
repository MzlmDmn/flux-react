const dbclient = require('mariasql');
const cryptojs = require('crypto-js');

const db = new dbclient({
    host: 'localhost',
    user: 'root',
    password: '***REMOVED***',
    db: '***REMOVED***'
});

module.exports = {

    // Channel

    createChannel : function(name, title, description, image, owner){

        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

            db.query('INSERT INTO pwd_channels SET name = :name, permaname = :permaname, title = :title, description = :description, image = :image, owner = :owner, created_at = :date',
                { name: name, permaname: name.toLowerCase(), title: title, description: description, image: '/img/default.png', owner: owner, date: date },
                function(err, rows) {
                    if (err)
                        throw err;
                    console.dir(rows);
                });

        db.end();
    },
    updateChannel : function(id, title, description, image) {

        db.query('UPDATE pwd_channels SET title = :title, description = :description, image = :image WHERE id = :id',
            {id: id, title: title, description: description, image: image},
            function (err, rows) {
                if (err)
                    throw err;
                console.dir(rows);
            });

        db.end();
    },

    deleteChannelById : function(id){

        db.query('DELETE FROM pwd_channels WHERE id = :id',
            { id: id },
            function(err){
                if(err)
                    throw err;
                // console.dir(rows);
            });
        db.end();
    },

    deleteChannelByName : function(name){

        db.query('DELETE FROM pwd_channels WHERE name = :name',
            { name: name },
            function(err){
                if(err)
                    throw err;
                // console.dir(rows);
            });

        db.end();
    },

    getChannelByName : function(name){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_channels WHERE name = :name',
                {name: name},
                function (err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    },

    getChannelById : function(id){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_channels WHERE id = :id',
                { id : id },
                function(err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    },

    getChannels : function(){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_channels', null,
                function (err, rows) {
                    if (err)
                        reject(err);
                    resolve(rows);
                }
            );

            db.end();
        });
    },

    // User

    createUser : function(username, password, mail, bio){

        // Encrypter le mot de passe pour le stocker en DB
        let encryptedpassword = cryptojs.AES.encrypt(password, 'Ma phrase secrète');

        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        db.query('INSERT INTO pwd_users SET username = :username, permaname = :permaname, password = :password, mail = :mail, bio = :bio, image = :image, history = :history, active = :active, created_at = :date',
            { username: username, permaname: username.toLowerCase(), password: encryptedpassword, mail: mail.toLowerCase(), image: '/img/default.png', bio: bio, history: '', active: false, date: date },
            function(err, rows) {
                if (err)
                    throw err;
                console.dir(rows);
            });

        db.end();
    },

    updateUser : function(id, password, mail, bio, image) {

        // Encrypter le mot de passe pour le stocker en DB
        let encryptedpassword = cryptojs.AES.encrypt(password, 'Ma phrase secrète');

        db.query('UPDATE pwd_users SET password = :password, mail = :mail, image = :image WHERE id = :id',
            {id: id, password: encryptedpassword, mail: mail, image: image},
            function (err, rows) {
                if (err)
                    throw err;
                console.dir(rows);
            });

        db.end();
    },

    updateUserHistory : function(id, history){
        let commatedHistory = history.join(', ');

        console.log(commatedHistory);

        db.query('UPDATE pwd_users SET history = :history WHERE id = :id',
            {id: id, history: commatedHistory},
            function (err, rows) {
                if (err)
                    throw err;
                console.dir(rows);
            });

        db.end();
    },

    activateUser : function(validationkey){

        return new Promise ((resolve, reject) => {
            db.query('UPDATE pwd_users SET active = :active, bio = :bio WHERE bio = :validationkey',
                {active: 1, bio: '', validationkey: validationkey},
                function (err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows);
                });

            db.end();
        });
    },

    deleteUserById : function(id){

        db.query('DELETE FROM pwd_users WHERE id = :id',
            { id: id },
            function(err){
                if(err)
                    throw err;
                // console.dir(rows);
            });
        db.end();
    },

    deleteUserByUsername : function(name){

        db.query('DELETE FROM pwd_users WHERE username = :username',
            { username: name },
            function(err){
                if(err)
                    throw err;
                // console.dir(rows);
            });

        db.end();
    },

    getUserByUsername : function(name){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_users WHERE username = :username',
                {username: name},
                function (err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    },

    getUserById : function(id){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_users WHERE id = :id',
                { id : id },
                function(err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    },

    getUserByMail : function(mail){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_users WHERE mail = :mail',
                { mail : mail },
                function(err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    },

    getUsers : function(){

        return new Promise ((resolve, reject) => {
            db.query('SELECT * FROM pwd_users', null,
                function (err, rows) {
                    if (err)
                        reject(err);
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    }
};

