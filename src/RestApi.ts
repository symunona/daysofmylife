/// <reference path="../typings/modules/koa-router/index.d.ts" />

import Persistence from './persistence/Persistence';
import * as Koa from 'koa';
import * as KoaRouter from 'koa-router';
import Auth from './middleware/auth';

const convert = require('koa-convert')

export default class RestApi{
    routers: Object;
    persistence: Persistence;
    constructor(app: Koa){
        let restApi = this;
        this.persistence = Persistence.getInstance();
        this.routers = {};

        for(var modelName in this.persistence.models){
            const urlRoot = modelName.toLowerCase(); 
            const Model = this.persistence.models[modelName];
            const PersistenceModel = this.persistence.persistenceModels[modelName];
            let router = this.routers[modelName] = new KoaRouter({prefix: '/api/'+urlRoot});
            
            console.log('[REST] registering',modelName, ': /api/'+urlRoot);

            // Get list
            router.get('/', function*(){    

                        if (!Auth.auth.call(this)) { return };

                        var filter = this.params.filter;
                        console.log('[REST] list... ', modelName, filter);

                        if (Model.prefilters && Model.prefilters[modelName]){                            
                            filter = Model.prefilters[modelName](filter, this);                            
                            console.log('[REST] prefilter found!', filter);
                        }

                        let results = yield PersistenceModel.findAll(filter);    
                        
                        if (Model.postfilters && Model.postfilters[modelName]){
                            
                            results = Model.postfilters[modelName](results, this);                            
                            console.log('[REST] postfilter found!', results);
                        }
                                    
                        this.body = results;

                        console.log('[REST] /list')          
                    });
            router.get('/:id', function *() { 
                        
                        if (!Auth.auth.call(this)) { return };
                        
                        console.log('[REST] loading... ', this.params.id);                        
                        let result = yield PersistenceModel.findAll({where: {id: this.params.id}});
                        result = result[0];

                        if (Model.postfilters && Model.postfilters[modelName]){                            
                            result = Model.postfilters[modelName]([result], this);  
                            if (!result.length){
                                this.body = '';
                                return;                          
                            }
                            else{
                                result = result[0];
                            }
                        }
                        
                        this.body = result;
                    });
            router.del('/:id', function *() { 

                        if (!Auth.auth.call(this)) { return };

                        console.log('[REST] deleting... ', this.params.id);      
                        if (!Auth.auth.call(this)) { return };                      
                        this.body = yield this.persistence.query('DELETE FROM ? WHERE id = ?',
                            { replacements: [modelName.toLowerCase(), this.params.id], 
                                type: this.persistence.QueryTypes.DELETE });
                        
                    });
            router.post('/', function *() { 
                    
                    if (!Auth.auth.call(this)) { return };
                    console.log('[REST] saving... ', this.params);
                    var persistentModelToSave = new PersistenceModel(this.params);
                    this.body = yield persistentModelToSave.save();
            }, Auth.auth);

            app.use(router.routes());
        }    
    }
    
}