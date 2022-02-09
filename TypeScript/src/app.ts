import express from 'express';
import Test1 from './test1/Test1';
const app = express();
const port = 81;

app.get('/test1', (req, res) => {
  Test1.processRequest(req.query.ID.toString(), res);
});
app.listen(port, () => {
  Test1.init();
  return console.log(`Express is listening at http://localhost:${port}`);
});