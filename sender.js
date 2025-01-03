const webSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });;
const connections = new Map();

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const {requestId} = JSON.parse(message);
        connections.set(requestId, ws);
    });

    ws.close('close', () => {
        connections.forEach((conn, id) => {
            if (conn === ws) {
                connections.delete(id);
                console.log(`Connection ${id} closed`);
            }
        });
    });
});

