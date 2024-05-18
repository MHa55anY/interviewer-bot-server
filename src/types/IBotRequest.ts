interface IBotRequest {
    roomId: string;
    roomCode: string;
    role: 'host' | 'guest';
}

export default IBotRequest;