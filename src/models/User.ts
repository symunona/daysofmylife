import Model from '../persistence/Model';
import Persistence from '../persistence/Persistence';
import * as _ from 'lodash';


export default class User extends Model{
    constructor(){ super() };
    
    @Model.persist('string')
    name: string;
    
    @Model.persist('string')
    email: string;

    @Model.persist('string')
    gid: string;
        
    @Model.persist('string')
    fbid: string;

    @Model.persist('string')
    twid: string;

    @Model.persist('string')
    password: string;

    // The context should be the requiest user 
    @Model.prefilter
    prefilter(filter, ctx) {
        console.log('[User] prefiltering', ctx)
        var currentUserId = ctx.passport.user.id;
        
        filter = filter || {};
        filter.where = filter.where || {};
        _.extend(filter.where, {id: {in: [currentUserId]}});
        console.log('[User] prefilter', filter);
        return filter
    }
    
    @Model.postfilter
    postfilter(results, ctx) {
        var ret = [];
        var currentUserId = ctx.passport.user.id;
        for(var i = 0; i<results.length; i++){
            
            if (currentUserId == results[i].id ) // or isAdmin
            {
                var plainObject = User.getPlainObject(results[i])
                delete plainObject.password;                
                ret.push(plainObject);    

            }
                        
        }
        return ret;
    }
}
