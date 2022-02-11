import express from 'express';
import Test1 from './test1/Test1';
import User from './model/User';
import WorkersPool from './test1/WorkersPool';
import ServerSession from './test1/ServerSession';
import Task from './model/Task';
const app = express();
const port = 81;
const th= 23;
// let count = 0;
if(th>1){
  app.get('/test1', (req, res) => {
    const id = req.query.ID.toString();
    let u = ServerSession.getUser(id);
    if(u===null|| u===undefined) {
      u=new User(id);
    }
    const t = new Task(id,u);
      WorkersPool.do(t,
        (r:string)=>{
          res.send(r);
          // count++;
          // console.log(count);
        }
      );
  });
}else{
  app.get('/test1', (req, res) => {
    const id = req.query.ID.toString();
    let u = ServerSession.getUser(id);
    if(u===null|| u===undefined) {
        u=new User(id);
    }
    Test1.processRequest(req.query.ID.toString(),u,(ris:string)=>{
         res.send(ris);
    });
  });
}


app.listen(port, () => {
  Test1.init();
  if(th>1){
    WorkersPool.init(th);
  }
  console.log(`Thread pool size: `+ th)
  return console.log(`Express is listening at http://localhost:${port}`);
});