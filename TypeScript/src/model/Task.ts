
import User from './User';

class Task{
    
    _id:string;
    _u:User;
    _ris:string;

    constructor(id:string,u:User){
        this._id=id;
        this._u=u;
        this._ris="Task not complete.";
    }


}


export default Task;