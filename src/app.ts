import * as Koa from 'koa';
import RestApi from './RestApi'
import Persistence from './Persistence';

class DaysOfMyLife {
    public static main(): void {
        const app = new Koa();
        
        // const persistence = new Persistence();
        const restApi = new RestApi(app);

        app.listen(3000, () => console.log('server started 3000'))

        console.log('eo main')        
        return;
    }
}

DaysOfMyLife.main();


