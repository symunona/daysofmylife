import Persistence from './Persistence';
import * as Koa from 'koa';

export default class RestApi{
    
    persistence: Persistence;
    constructor(app: Koa){
        this.persistence = Persistence.getInstance();
        for(var model in this.persistence.models){
            app.use
        }    
    }
    
}