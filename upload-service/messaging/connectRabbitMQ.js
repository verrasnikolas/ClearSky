const amqplib = require('amqplib');

let channel;

async function connectRabbitMQ() {
    //const connection = await amqplib.connect('amqp://host.docker.internal:5672');
    const connection = await amqplib.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('[✔] Connected to RabbitMQ');
}

function getChannel() {
    if (!channel) throw new Error('RabbitMQ channel not ready');
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };
