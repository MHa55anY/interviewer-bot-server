import express from 'express';
import startWebSocketServer from './controllers/websocket';
import cors from 'cors';
import { talkToGpt } from './controllers/openai';

const app = express();
app.use(cors());

app.get("/", (req,res) => {
  res.send("hello world");
})

app.post("/talk", (req,res) => {
  res.send("hello world");
});

app.get("/init-bot", (_, res) => {
  talkToGpt();
  res.send({message: "Bot initialsed!"});
});

startWebSocketServer();
app.listen('8000', () => console.log("Server started on port 8000"));

