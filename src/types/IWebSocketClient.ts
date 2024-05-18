import WebSocket from 'ws';

interface IWebSocketClient {
    token: string;
    role: 'host' | 'guest';
    ws: WebSocket;
}

export default IWebSocketClient;