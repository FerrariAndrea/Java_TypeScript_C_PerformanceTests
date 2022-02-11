"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
// import User from '../model/User';
const ServerSession_1 = __importDefault(require("./ServerSession"));
class WorkersPool {
    static init(poolSize) {
        for (let x = 0; x < poolSize; x++) {
            const myID = x;
            WorkersPool.pool.push(new worker_threads_1.Worker('./dist/test1/MyWorker.js'));
            WorkersPool.pool[myID].on('message', (t) => {
                // const newU = new User(t._id)
                // newU.mytriples=t._u.mytriples;
                // newU.counter= t._u.counter;
                ServerSession_1.default.addUser(t._id, t._u);
                const cb = WorkersPool.doingRes.get(t._id);
                WorkersPool.doingRes.delete(t._id);
                cb(t._ris);
                if (WorkersPool.waitingQueue.length > 0) {
                    // console.log("WorkersPool.waitingQueue.length.before: "+WorkersPool.waitingQueue.length);
                    const next = WorkersPool.waitingQueue.shift();
                    // console.log("WorkersPool.waitingQueue.length.after: "+WorkersPool.waitingQueue.length);
                    // console.log("myID: "+myID);
                    WorkersPool.pool[myID].postMessage(next);
                }
                else {
                    WorkersPool.ready.push(myID);
                }
            });
            WorkersPool.ready.push(myID);
        }
    }
    static do(t, res) {
        WorkersPool.doingRes.set(t._id, res);
        if (WorkersPool.waitingQueue.length > 0) {
            // console.log("WorkersPool.waitingQueue.length: "+WorkersPool.waitingQueue.length);
            WorkersPool.waitingQueue.push(t);
        }
        else {
            const _workerID = WorkersPool.ready.shift();
            if (_workerID === undefined) {
                WorkersPool.waitingQueue.push(t);
            }
            else {
                WorkersPool.pool[_workerID].postMessage(t);
            }
        }
    }
}
WorkersPool.waitingQueue = new Array();
WorkersPool.pool = new Array();
WorkersPool.ready = new Array();
WorkersPool.doingRes = new Map();
exports.default = WorkersPool;
//# sourceMappingURL=WorkersPool.js.map