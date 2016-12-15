import * as Koa from 'koa';
import RestApi from './RestApi'

import Auth from './middleware/auth';
import Index from './middleware/index';


class DaysOfMyLife {
    static restApi: RestApi;
    static auth: Auth;
    public static main(): void {
        const app = new Koa();
        app.keys = ['your-session-secret-pina']
        // Session setup

        this.auth = new Auth(app);

        // const persistence = new Persistence();
        this.restApi = new RestApi(app);

        new Index(app);
        
        app.listen(3001, () => console.log('server started 3001'))

        console.log('eo main')        
        return;
    }
}

DaysOfMyLife.main();


