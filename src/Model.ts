/// <reference path="../typings/globals/reflect-metadata/index.d.ts" />
/// <reference path="../typings/modules/sequelize/index.d.ts" />

import 'reflect-metadata';
import * as Sequelize from "sequelize";
import * as _ from 'lodash';


export default class Model {

    static fields = {};

    @Model.persist('string')
    id: string;

    @Model.persist('date')
    lastModifyDate: Date;

    @Model.persist('date')
    createDate: Date;

    constructor() { }
    init() {
        console.log('init', this);
    }
    save() {
        console.log('save', this);
    }

    static unique(target: any, key: string){
        let model = {};
        model[target.constructor.name] = {};
        model[target.constructor.name][key] = { unique: true }; 
        _.extend(Model.fields, model);
    }

    static persist(type: string) : PropertyDecorator {
        return function (target: any, fieldName: string, descriptor: PropertyDescriptor) {
            // console.log(`[field] [${target.constructor.name}]`, fieldName,  type)
            let field = {};            
            field[fieldName] = {                
                type: type
            };
            if (!Model.fields[target.constructor.name]) Model.fields[target.constructor.name] = {}; 
            _.extend(Model.fields[target.constructor.name], field);            
        };        
    }

    static getSchema(){
        let name = this.prototype.constructor.name;
        let fields = _.extend({}, this.fields['Model'], this.fields[name]);
        let definitionObject = {}
        for (let fieldName in fields){            
            let field = fields[fieldName];            
            field = _.extend({}, field, { type: this.getSequelizeFieldType(field.type) });                         
            _.extend(definitionObject, { [fieldName]: field });            
        }
        definitionObject['id'].primaryKey = true;
        return definitionObject;
    }
    static getSequelizeFieldType(type: string) : any{
        switch(type){
            case 'string':
                return Sequelize.STRING;
            case 'text':
                return Sequelize.TEXT;
            case 'date':
                return Sequelize.DATE;
            case 'default':
                console.error('Type not defined!');
                return null;            
        }
        return 
    }

    static test(target: any, key: string) {
        console.log('[metadata class]', key, target);
        var t = Reflect.getOwnMetadataKeys(target);
        console.log(t)
        console.log(`[metadata] ${key} type: ${t}`);
    }
    public getClassName() {

            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec((this).constructor.toString());
            return (results && results.length > 1) ? results[1] : "";
            
    }
}