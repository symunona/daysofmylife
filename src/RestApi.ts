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
            const Model = this.persistence.models[modelName];
            let router = this.routers[modelName] = new KoaRouter({prefix: '/api/'+urlRoot});
            console.log('[REST] ',modelName, ': /api/'+urlRoot);
            // Get list
            router.get('/', function *() { restApi.list(this, Model, arguments) });
            router.get('/:id', function *() { restApi.getInstanceById(this, Model, this.params.id) });
            router.post('/', function *() { restApi.saveInstance(this, Model, this.params.data) });

            app.use(router.routes());
        }    
    }
    list(ctx, model, filter){
        
        ctx.body = [{name: 'asdf test list response'}]         
        
    }
    getInstanceById(ctx, Model, id){
        
        ctx.body = new Model() 
        
    }
    saveInstance(ctx, Model, data){
        console.log('[REST] saving... ', data);
        ctx.body = 'saving: ' + data;
    
    }
    
}