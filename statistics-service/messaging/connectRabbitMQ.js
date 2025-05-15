const amqplib = require('amqplib');
let channel;
async function connectRabbitMQ() {
    try {
        const connection = await amqplib.connect('amqp://host.docker.internal:5672');
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