import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';

const startWebSocketServer = () => {
    const wss = new WebSocket.Server({ port: 8081 });

    wss.on('connection', (ws) => {
        const audioStream = fs.readFileSync(path.join(__dirname, "../speech.mp3"));
        ws.send(audioStream);
  
      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
};

export default startWebSocketServer;
