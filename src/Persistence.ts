

import * as Sequelize from "sequelize";
import * as fs from "fs";

const dbsettings = require('../config/database.json');

export default class Persistence{
    adapter: Object;
    models = {};
    persistenceModels = {};
    
    static instance: Persistence;

    static getInstance(){
        if (this.instance) return this.instance;

        this.instance = new Persistence();
        this.instance.adapter = new Sequelize(dbsettings.database, dbsettings.username, dbsettings.password, dbsettings.options);
        
        var list = fs.readdirSync('lib/models');        
        
        list
            .filter((name)=> name.endsWith('.js'))
            .map((name)=> this.instance.models[name.substr(0,name.length-3)] = require('../lib/models/'+name).default);
        
        for(var modelName in this.instance.models){
            let Model = this.instance.models[modelName];
            let schema = Model.getSchema();                 
            this.instance.persistenceModels[modelName] =
                this.instance.adapter.define( modelName.toLowerCase(), schema );        
            console.log('[Persistence] Defined', modelName);
            this.instance.persistenceModels[modelName].sync();
        }

        console.log('[Persistence] MySQL adapter hooked up to ', dbsettings.options.host);

        return this.instance;
    }

} 