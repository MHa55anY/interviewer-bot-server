import express from 'express';
import startWebSocketServer, { webSocket } from './controllers/websocket';
import cors from 'cors';
import { talkToGpt, textToSpeech } from './controllers/openai';
import startBot from './controllers/bot';
import IBotRequest from './types/IBotRequest';

const app = express();
app.use(cors());

app.post("/init-bot", async (req, res) => {
  const {role, roomCode, roomId} = req.body as IBotRequest;

  try {
    if(role == 'host') {
      const textResponse = await talkToGpt();
      if(textResponse) {
        const speech = await textToSpeech(textResponse);
        if(speech) webSocket.send(speech);
      }
      else {
        throw new Error("Got no response from gpt");
      };
    }
    if(role === 'guest') {
      await startBot(roomId, roomCode);
    }
    res.send({message: "Bot initialsed!"});
  } catch (error) {
    res.send('Failed to initialise bot!').status(500);
    console.error('Failed to initialise bot!: ', error);
  }
});

startWebSocketServer();
app.listen('8000', () => console.log("Server started on port 8000"));

