const {PubSub} = require('@google-cloud/pubsub');
const {clientMap} = require('./websocket.js');

const pubSubClient = new PubSub({
    keyFilename: './add-subtract-key.json',
});
const subscriptionName = 'projects/add-subtract-445922/subscriptions/numbers-topic-sub';

const messageHandler = (message) => {
    try {
        const data = JSON.parse(message.data.toString());
        const {num1, num2, operation, requestId} = data;

        let result;
        if (operation === 'add') {
            result = num1 + num2;
        } else if (operation === 'subtract') {
            result = num1 - num2;
        } else {
            throw new Error(`Invalid operation : ${operation}`);
        }
        console.log(`Request id : ${requestId}, operation : ${operation}, result : ${result}`);

        const client = clientMap.get(requestId);
        if(client) {
            client.send(JSON.stringify({requestId,result}));
        } else {
            console.error(`Client not found for request id : ${requestId}`);
        }

        message.ack();
    } catch (error) {
        console.error('Error procesing message', error);
        message.nack();
    }
}

const listenForMessages = () => {
    pubSubClient.subscription(subscriptionName).on('message', messageHandler); 
};

module.exports = listenForMessages;