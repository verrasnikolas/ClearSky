const amqplib = require('amqplib');
const host = process.env.RABBITMQ_HOST || 'localhost';
const port = process.env.RABBITMQ_PORT || '5672';
const user = process.env.RABBITMQ_USER || 'guest';
const pass = process.env.RABBITMQ_PASS || 'guest';

let channel;

async function connectRabbitMQ() {
    try {
        const connection = await amqplib.connect(`amqp://${user}:${pass}@${host}:${port}`);
        channel = await connection.createChannel();
        console.log('[✔] Connected to RabbitMQ');
    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }
}

function getChannel() {
    if (!channel) throw new Error('RabbitMQ channel not ready');
    return channel;
}

module.exports = { connectRabbitMQ, getChannel };
