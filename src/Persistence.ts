import * as Sequelize from "sequelize";
import * as fs from "fs";

import Day from './models/Day';

const dbsettings = require('../config/database.json');

export default class Persistence{
    adapter: Object;
    models: Object;
    
    static instance: Persistence;

    static getInstance(){
        if (this.instance) return this.instance;

        this.instance = new Persistence();
        this.instance.adapter = new Sequelize(dbsettings.database, dbsettings.username, dbsettings.password, dbsettings.options);
        console.log('MySQL adapter hooked up');

        var list = fs.readdirSync('lib/models');
        console.log(list);
        this.instance.models = {};
        list
            .filter((name)=> name.endsWith('.js'))
            .map((name)=> this.instance.models[name.substr(0,name.length-3)] = require('../lib/models/'+name));
        
        return this.instance;
    }

} 