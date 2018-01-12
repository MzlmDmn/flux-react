const dbclient = require('mariasql');

const db = new dbclient({
    host: 'localhost',
    user: 'root',
    password: 'MDP',
    db: '***REMOVED***'
});

module.exports = {
    createChannel : function(name, title, description, image, owner, mods){

        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

            db.query('INSERT INTO pwd_channels SET name = :name, permaname = :permaname, title = :title, description = :description, image = :image, owner = :owner, created_at = :date',
                { name: name, permaname: name.toLowerCase(), title: title, description: description, image: image, owner: owner, date: date },
                function(err, rows) {
                    if (err)
                        throw err;
                    console.dir(rows);
                });

        db.end();
    },
    updateChannel : function(id, title, description, image) {

        db.query('UPDATE pwd_channels SET name = :name, title = :title, description = :description, image = :image WHERE id = :id',
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
                    resolve(rows[0]);
                }
            );

            db.end();
        });
    }
};

