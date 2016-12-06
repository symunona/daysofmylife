


import Model from '../Model';
import Persistence from '../Persistence';


export default class User extends Model{
    constructor(){ super() };
    
    @Model.persist('string')
    name: string;
    
    @Model.persist('string')
    email: string;
        
    @Model.persist('string')
    password: string;

}
