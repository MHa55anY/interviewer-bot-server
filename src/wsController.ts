import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws) => {
        console.log("client connected!");
        const audioStream = fs.readFileSync(path.join(__dirname, "../speech.mp3"));
        ws.send(audioStream);

        ws.addEventListener("message", (event) => {
            const audioBuffer = event.data as Buffer;
            const speechFile = path.resolve("./test.mp3");
            fs.writeFileSync(speechFile, audioBuffer);
        });
  
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
};

export default startWebSocketServer;
