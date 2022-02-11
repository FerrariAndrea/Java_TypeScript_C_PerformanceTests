import { Worker } from 'worker_threads';
import Task from '../model/Task';
// import User from '../model/User';
import ServerSession from './ServerSession';

class WorkersPool{
    private static waitingQueue: Array<Task>= new Array<Task>(); 
    private static pool: Array<Worker>= new Array<Worker>(); 
    private static ready: Array<number>= new Array<number>(); 
    private static doingRes =new Map<string,(ris:string)=>void>();
   
    public static init(poolSize:number):void{
        for(let x=0;x<poolSize;x++){
            const myID=x;
            WorkersPool.pool.push(new Worker('./dist/test1/MyWorker.js'));
            WorkersPool.pool[myID].on('message', (t:Task) => {
                // const newU = new User(t._id)
                // newU.mytriples=t._u.mytriples;
                // newU.counter= t._u.counter;
                ServerSession.addUser(t._id,t._u);
                const cb = WorkersPool.doingRes.get(t._id);
                WorkersPool.doingRes.delete(t._id);                
                cb(t._ris);
                if(WorkersPool.waitingQueue.length>0){
                    // console.log("WorkersPool.waitingQueue.length.before: "+WorkersPool.waitingQueue.length);
                    const next = WorkersPool.waitingQueue.shift();
                    // console.log("WorkersPool.waitingQueue.length.after: "+WorkersPool.waitingQueue.length);
                    // console.log("myID: "+myID);
                    WorkersPool.pool[myID].postMessage(next);
                }else{
                    WorkersPool.ready.push(myID);
                }
            });
            WorkersPool.ready.push(myID);
        }
    }

    public static do(t:Task,res:(ris:string)=>void):void{
        WorkersPool.doingRes.set(t._id,res);
        if(WorkersPool.waitingQueue.length>0){
            // console.log("WorkersPool.waitingQueue.length: "+WorkersPool.waitingQueue.length);
            WorkersPool.waitingQueue.push(t);
        }else{
            const _workerID = WorkersPool.ready.shift();
            if(_workerID===undefined){
                WorkersPool.waitingQueue.push(t);
            }else{
                WorkersPool.pool[_workerID].postMessage(t);
            }
        }
    }
  
}


export default WorkersPool;