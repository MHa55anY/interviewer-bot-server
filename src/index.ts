import express from 'express';
import startWebSocketServer, { webSocket } from './controllers/websocket';
import cors from 'cors';
import { talkToGpt, textToSpeech } from './controllers/openai';

const app = express();
app.use(cors());

app.get("/", (req,res) => {
  res.send("hello world");
})

app.post("/talk", (req,res) => {
  res.send("hello world");
});

app.get("/init-bot", async (_, res) => {
  const textResponse = await talkToGpt();
  if(textResponse) {
    const res = await textToSpeech(textResponse);
    if(res) webSocket.send(res);
  };
  res.send({message: "Bot initialsed!"});
});

startWebSocketServer();
app.listen('8000', () => console.log("Server started on port 8000"));

