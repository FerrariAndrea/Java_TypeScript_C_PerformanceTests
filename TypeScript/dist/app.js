"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Test1_1 = __importDefault(require("./test1/Test1"));
const User_1 = __importDefault(require("./model/User"));
const WorkersPool_1 = __importDefault(require("./test1/WorkersPool"));
const ServerSession_1 = __importDefault(require("./test1/ServerSession"));
const Task_1 = __importDefault(require("./model/Task"));
const app = (0, express_1.default)();
const port = 81;
const th = 23;
// let count = 0;
// if(th===1){
//   app.get('/test1', (req, res) => {
//     const id = req.query.ID.toString();
//     let u = ServerSession.getUser(id);
//     if(u===null|| u===undefined) {
//         u=new User(id);
//     }
//     Test1.processRequest(req.query.ID.toString(),u,(ris:string)=>{
//          res.send(ris);
//     });
//   });
// }else{
app.get('/test1', (req, res) => {
    const id = req.query.ID.toString();
    let u = ServerSession_1.default.getUser(id);
    if (u === null || u === undefined) {
        u = new User_1.default(id);
    }
    const t = new Task_1.default(id, u);
    WorkersPool_1.default.do(t, (r) => {
        res.send(r);
        // count++;
        // console.log(count);
    });
});
// }
app.listen(port, () => {
    Test1_1.default.init();
    if (th > 1) {
        WorkersPool_1.default.init(th);
    }
    console.log(`Thread pool size: ` + th);
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map