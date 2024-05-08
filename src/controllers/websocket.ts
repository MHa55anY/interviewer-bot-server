import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { talkToGpt, textToSpeech, transcribeSpeechAndPushToHistory } from './openai';

export let webSocket: WebSocket;

let clients: WebSocket[] = [];

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws) => {
        webSocket = ws;
        console.log("client connected!", clients.length);
        clients.push(ws);

        ws.addEventListener("message", async (event) => {
            const speechFile = path.resolve("./test.mp3");
            fs.writeFileSync(speechFile, Buffer.from(event.data as Buffer), 'binary');
            await transcribeSpeechAndPushToHistory();
            const textResponse = await talkToGpt();
            if(textResponse) {
                const res = await textToSpeech(textResponse);
                const receiver = clients.find((c) => c !== ws);
                if(res && receiver) {
                    receiver.send(res);
                    console.log("Sent audio message to client");
                }
            };
        });
        
        ws.on('close', () => {
            clients = clients.filter(client => client !== ws);
            console.log('Client disconnected');
        });
    });
};

export default startWebSocketServer;
