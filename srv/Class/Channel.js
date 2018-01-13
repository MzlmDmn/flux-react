'use strict';

module.exports = class Channel {
    constructor(id, name, permaname, title, description, image, owner, mods, created_at){
        this.name = name;
        this.permaname = permaname;
        this.title = title;
        this.description = description;
        this.image = image;
        this.owner = owner;
        this.mods = mods;
        this.created_at = created_at;
    }

    setId(data){
        return this.id = data;
    }

    getId(){
        return this.id;
    }

    setName(data){
        return this.name = data;
    }

    getName(){
        return this.name;
    }

    setPermaname(data){
        return this.permaname = data;
    }

    getPermaname(){
        return this.permaname;
    }

    setTitle(data){
        return this.title = data;
    }

    getTitle(){
        return this.title;
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

    setOwner(data){
        return this.owner = data;
    }

    getOwner(){
        return this.owner;
    }

    setMods(data){
        return this.mods = data;
    }

    getMods(){
        return this.mods;
    }

};