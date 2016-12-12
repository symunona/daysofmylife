/// <reference path="../typings/modules/koa-router/index.d.ts" />

import Persistence from './persistence/Persistence';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import Auth from './middleware/auth';

export default class RestApi{
    routers: Object;
    persistence: Persistence;
    constructor(app: Koa){
        let restApi = this;
        this.persistence = Persistence.getInstance();
        this.routers = {};

        for(var modelName in this.persistence.models){
            const urlRoot = modelName.toLowerCase(); 
            // const Model = this.persistence.models[modelName];
            const PersistenceModel = this.persistence.persistenceModels[modelName];
            let router = this.routers[modelName] = new KoaRouter({prefix: '/api/'+urlRoot});
            
            console.log('[REST] registering',modelName, ': /api/'+urlRoot);
            // Get list
            router.get('/', async function (){                                      
                        console.log('[REST] list... ', modelName, this.params.filter);                                   
                        this.body = yield PersistenceModel.findAll(this.params.filter);
                    }, Auth.auth);
            router.get('/:id', async function () { 
                        console.log('[REST] loading... ', this.params.id);                            
                        this.body = yield PersistenceModel.findOne({id: this.params.id});    
                    }, Auth.auth);
            router.del('/:id', async function () { 
                        console.log('[REST] deleting... ', this.params.id);                            
                        this.body = yield this.persistence.query('DELETE FROM ? WHERE id = ?',
                            { replacements: [modelName.toLowerCase(), this.params.id], 
                                type: this.persistence.QueryTypes.DELETE });
                        
                    }, Auth.auth);
            router.post('/', async function () { 
                    console.log('[REST] saving... ', this.params);
                    var persistentModelToSave = new PersistenceModel(this.params);
                    this.body = yield persistentModelToSave.save();    
            }, Auth.auth);
            
            app.use(router.routes());
        }    
    }
    
}