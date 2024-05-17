import express from 'express';
import startWebSocketServer, { webSocket } from './controllers/websocket';
import cors from 'cors';
import { talkToGpt, textToSpeech } from './controllers/openai';
import startBot from './controllers/bot';

const app = express();
app.use(cors());

app.get("/init-bot", async (req, res) => {
  const role: string = req.query.role as string;
  if(role == 'host') {
    console.log(role);
    const textResponse = await talkToGpt();
    if(textResponse) {
      const speech = await textToSpeech(textResponse);
      if(speech) webSocket.send(speech);
    };
  }
  if(role === 'guest') {
    await startBot();
  }
  res.send({message: "Bot initialsed!"});
});

startWebSocketServer();
app.listen('8000', () => console.log("Server started on port 8000"));

