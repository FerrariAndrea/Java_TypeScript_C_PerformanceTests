import { parentPort } from 'worker_threads';
import Task from '../model/Task';
import User from '../model/User';
import Test1 from './Test1';

parentPort.on('message',(t:Task)=>{
    const u =new User(t._id);
    u.mytriples = t._u.mytriples;
    u.mySubject = t._u.mySubject;
    u.counter= t._u.counter;
    const rebuildTask = new Task(t._id,u);

    Test1.processRequest(rebuildTask._id,rebuildTask._u,(u:User,ris:string)=>{
        // console.log("Test1.processRequest.cb.ris: ", ris);
        rebuildTask._ris=ris;
        rebuildTask._u=u;//maybe this is not necessary
        parentPort.postMessage(rebuildTask);
    });

});

 
