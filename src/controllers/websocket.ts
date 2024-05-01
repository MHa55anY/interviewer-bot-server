import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { talkToGpt, textToSpeech, transcribeSpeechAndPushToHistory } from './openai';

export let webSocket: WebSocket;

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws) => {
        webSocket = ws;
        console.log("client connected!");
        const audioStream = fs.readFileSync(path.join(__dirname, "../../speech.mp3"));
        ws.send(audioStream);

        ws.addEventListener("message", async (event) => {
            const speechFile = path.resolve("./test.mp3");
            fs.writeFileSync(speechFile, Buffer.from(event.data as Buffer), 'binary');
            await transcribeSpeechAndPushToHistory();
            const textResponse = await talkToGpt();
            if(textResponse) {
                const res = await textToSpeech(textResponse);
                if(res) ws.send(res);
            };
        });
        
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

export default startWebSocketServer;
