import Model from '../Model';

export default class Tag extends Model{
    constructor(){ super() };
    
    @Model.persist('string')
    userId: string;
    
    @Model.persist('string')
    name: string;

    @Model.persist('date')
    startDate: Date;

    @Model.persist('date')
    endDate: Date;
    
    @Model.persist('string')
    type: string;
    
}
