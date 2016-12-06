/// <reference path="../typings/modules/koa-router/index.d.ts" />

import Persistence from './Persistence';
import * as Koa from 'koa';

import * as KoaRouter from 'koa-router';

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
            console.log('[REST] ',modelName, ': /api/'+urlRoot);
            // Get list
            router.get('/', function *(){                                      
                        console.log('[REST] list... ', this.params.filter);                                   
                        this.body = yield PersistenceModel.findAll(this.params.filter);
                    });
            router.get('/:id', function *() { 
                        console.log('[REST] loading... ', this.params.id);                            
                        this.body = yield PersistenceModel.findOne({id: this.params.id});    
                    });
            router.post('/', function *() { 
                    console.log('[REST] saving... ', this.params);
                    var persistentModelToSave = new PersistenceModel(this.params);
                    this.body = yield persistentModelToSave.save();    
            });
            app.use(router.routes());
        }    
    }
    
}