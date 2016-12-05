/// <reference path="../typings/modules/sequelize/index.d.ts" />

import * as Sequelize from "sequelize";
import * as fs from "fs";

const dbsettings = require('../config/database.json');

export default class Persistence{
    adapter: Object;
    models: Object;
    
    static instance: Persistence;

    static getInstance(){
        if (this.instance) return this.instance;

        this.instance = new Persistence();
        this.instance.adapter = new Sequelize(dbsettings.database, dbsettings.username, dbsettings.password, dbsettings.options);
        console.log('[Persistence] MySQL adapter hooked up to ', dbsettings.options.host);

        var list = fs.readdirSync('lib/models');        
        this.instance.models = {};
        list
            .filter((name)=> name.endsWith('.js'))
            .map((name)=> this.instance.models[name.substr(0,name.length-3)] = require('../lib/models/'+name).default);
        
        for(var modelName in this.instance.models){
            var Model = this.instance.models[modelName];
            console.log('def', modelName, Object.keys(Model.getSchema()))
            // console.log(Model);
            // debugger;
        }

        return this.instance;
    }
    static define(){
        
    }
    

} 