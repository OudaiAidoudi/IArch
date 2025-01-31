/**
 * this model specifies the format to exchange an evaluation record
 */
import {SalesMan} from './SalesMan';

export class EvaluationRecord{
    public _id: string;
    public goalDescription: string;
    public targetValue: string;
    public actualValue: string;
    public year: string;
    public salesManID: string;
    public salesMan: SalesMan;
}

export class Goal {
    public goal_id: number;
    public goalDescription: string;

    constructor(goal_id: number, goal_description: string) {
        this.goal_id = goal_id;
        this.goalDescription = goal_description;
    }
}
