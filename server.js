const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const publishMessage = require('./publisher.js');
const listenForMessages = require('./subscriber.js');


const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

app.post('/call', async(req, res) => {
    const {num1, num2, operation, id} = req.body;
    console.log("Request received", req.body);
    if (num1 === undefined || num2 === undefined || !operation || !id) {
        return res.status(400).json({error: 'Missing Files'});
    }

    const message = {num1, num2, operation, requestId : id};
    publishMessage(message, res);
});

listenForMessages();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})