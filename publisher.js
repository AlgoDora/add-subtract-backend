const {PubSub} = require('@google-cloud/pubsub');

const pubSubClient = new PubSub({
    keyFilename: './add-subtract-key.json',
});
const topicName = 'projects/add-subtract-445922/topics/numbers-topic';

const publishMessage = async (message, res) => {
    try {
        const dataBuffer = Buffer.from(JSON.stringify(message));
        const messageId = await pubSubClient.topic(topicName).publishMessage({data : dataBuffer});

        res.status(200).json({
            message : `Message ${messageId} published`,
            data : message
        })
    } catch (err) {
        console.error("Error while publishing", err);
        res.status(500).json({error : "failed to publish to pub/sub"});
    }
};

module.exports = publishMessage;