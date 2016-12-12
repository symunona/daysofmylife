import * as Koa from 'koa';
import Persistence from '../persistence/Persistence'
import * as fs from "fs";
import * as KoaRouter from 'koa-router';
import Auth from './auth';

const config = require('../../config/general.json');

export default class Index {
    
    persistence: Persistence;

    constructor(app: Koa) {

        this.persistence = Persistence.getInstance();
        let route = new KoaRouter();

        route.get('/',  Auth.auth, function() {
            this.type = 'html'            
            this.body = fs.readFileSync('src/views/index.authed.html')
        });

        route.get('/login', function() {
            this.type = 'html'            
            this.body = fs.readFileSync('src/views/auth/login.html')
        })


        app.use(route.routes());

    }
}
