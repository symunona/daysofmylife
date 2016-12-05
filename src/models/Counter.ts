import Model from '../Model';

export default class Day extends Model{
    constructor(){ super() };
    title: string;
    startDate: Date;
    endDate: Date;
    type: string;
    
}
