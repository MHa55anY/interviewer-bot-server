import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { talkToGpt, transcribeSpeechAndPushToHistory } from './openai';

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws) => {
        console.log("client connected!");
        const audioStream = fs.readFileSync(path.join(__dirname, "../../speech.mp3"));
        ws.send(audioStream);

        ws.addEventListener("message", async (event) => {
            const speechFile = path.resolve("./test.mp3");
            fs.writeFileSync(speechFile, Buffer.from(event.data as Buffer), 'binary');
            await transcribeSpeechAndPushToHistory();
            talkToGpt();
        });
        
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

export default startWebSocketServer;
