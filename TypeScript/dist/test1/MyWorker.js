"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const Task_1 = __importDefault(require("../model/Task"));
const User_1 = __importDefault(require("../model/User"));
const Test1_1 = __importDefault(require("./Test1"));
worker_threads_1.parentPort.on('message', (t) => {
    const u = new User_1.default(t._id);
    u.mytriples = t._u.mytriples;
    u.mySubject = t._u.mySubject;
    u.counter = t._u.counter;
    const rebuildTask = new Task_1.default(t._id, u);
    Test1_1.default.processRequest(rebuildTask._id, rebuildTask._u, (u, ris) => {
        // console.log("Test1.processRequest.cb.ris: ", ris);
        rebuildTask._ris = ris;
        rebuildTask._u = u; //maybe this is not necessary
        worker_threads_1.parentPort.postMessage(rebuildTask);
    });
});
//# sourceMappingURL=MyWorker.js.map