import * as Koa from 'koa';

import Persistence from './persistence';

class DaysOfMyLife {
    public static main(): void {
        const app = new Koa();
        
        // const persistence = new Persistence();
        const restApi = new restApi(app);

        
        app.use(function*(){
            this.body = 'Hello World';
        })

        app.listen(3000, () => console.log('server started 3000'))

        console.log('eo main')        
        return;
    }
}

DaysOfMyLife.main();


