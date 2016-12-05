


import Model from '../Model';
import Persistence from '../Persistence';


export default class Day extends Model{
    constructor(){ super() };
    
    @Model.persist('string')
    title: string;
        
    @Model.persist('text')
    body: string;
    
    @Model.unique
    @Model.persist('date')
    date: Date;

    @Model.persist('string')
    userId: string;
    
}

function persist(value: string){

}