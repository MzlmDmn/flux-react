'use strict';

module.exports = class User {
    constructor(id, username, permaname, password, mail, bio, image, history, active, role, created_at){
        this.id = id;
        this.username = username;
        this.permaname = permaname;
        this.password = password;
        this.mail = mail;
        this.bio = bio;
        this.image = image;
        this.history = history;
        this.active = active;
        this.role = role;
        this.created_at = created_at;
    }

    setId(data){
        return this.id = data;
    }

    getId(){
        return this.id;
    }

    setUsername(data){
        return this.username = data;
    }

    getUsername(){
        return this.username;
    }

    setPermaname(data){
        return this.permaname = data;
    }

    getPermaname(){
        return this.permaname;
    }

    setMail(data){
        return this.mail = data;
    }

    getMail(){
        return this.mail;
    }

    setDescription(data){
        return this.description = data;
    }

    getDescription(){
        return this.description;
    }

    setImage(data){
        return this.image = data;
    }

    getImage(){
        return this.image;
    }

    setHistory(data){
        return this.history = data;
    }

    getHistory(){
        return this.history;
    }

};