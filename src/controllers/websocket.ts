import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import { talkToGpt, textToSpeech, transcribeSpeechAndPushToHistory } from './openai';
import url from 'url';
import IWebSocketClient from '../types/IWebSocketClient';

export let webSocket: WebSocket;

let clients: IWebSocketClient[] = [];

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws, req) => {
        webSocket = ws;
        console.log("client connected!", clients.length);
        const {query: { token, role }} = url.parse(req.url ?? '', true);
        clients.push({ws, token: token as string, role: role as 'host' | 'guest'});

        ws.addEventListener("message", async () => {
            try {
                await transcribeSpeechAndPushToHistory();
                const textResponse = await talkToGpt();
                if(textResponse) {
                    const res = await textToSpeech(textResponse);
                    const senderClient = clients.find((c) => c.ws === ws && c.role === 'guest');
                    if(!senderClient) throw new Error("Host client supposed to receive audio from candidate, not send");
                    const receiverClient = clients.find((c) => c.ws !== ws && c.token === senderClient?.token);
                    if (!receiverClient) throw new Error("Receiver client not found!");
                    if(res && receiverClient) {
                        receiverClient.ws.send(res);
                        console.log("Sent audio message to client");
                    }
                };
            } catch (error) {
                console.error("Error in sending audio to webSocket client:", error);
            }
        });
        
        ws.on('close', () => {
            clients = clients.filter(client => client.ws !== ws);
            console.log('Client disconnected');
        });
    });
};

export default startWebSocketServer;
