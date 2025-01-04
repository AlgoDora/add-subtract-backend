const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });;

const clientMap = new Map();

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message',(message) => {
        const {requestId} = JSON.parse(message);
        console.log(`Received id from client : ${ requestId}`); 
        clientMap.set(requestId, ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        for (const [key, value] of clientMap.entries()) {
            if(value === ws){
                clientMap.delete(key);
            }
        }
    });
});

module.exports = {clientMap};