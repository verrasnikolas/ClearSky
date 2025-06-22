const amqp = require('amqplib');
const host = process.env.RABBITMQ_HOST || 'localhost';
const port = process.env.RABBITMQ_PORT || '5672';
const user = process.env.RABBITMQ_USER || 'guest';
const pass = process.env.RABBITMQ_PASS || 'guest';

let connection = null;
let channel = null;

const RABBITMQ_URL = `amqp://${user}:${pass}@${host}:${port}`;
const CLEAR_SKY_EVENTS_EXCHANGE = 'clear_sky_events';

async function connectRabbitMQ() {
    if (!channel) { // Only connect and assert if not already connected
        try {
            connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();

            // Assert the main topic exchange for all business events
            await channel.assertExchange(CLEAR_SKY_EVENTS_EXCHANGE, 'topic', { durable: true });
            console.log(`[🚀] RabbitMQ Connected and Topic Exchange "${CLEAR_SKY_EVENTS_EXCHANGE}" asserted.`);

            // Handle connection close/errors for robustness
            connection.on('close', () => {
                console.error('[❌] RabbitMQ connection closed. Attempting to reconnect...');
                channel = null; // Clear channel to force re-creation
                // Implement a robust reconnection strategy here (e.g., exponential backoff)
                setTimeout(connectRabbitMQ, 5000); // Simple reconnect attempt after 5 seconds
            });
            connection.on('error', (err) => {
                console.error('[🚨] RabbitMQ connection error:', err);
            });

        } catch (error) {
            console.error('[💥] Failed to connect to RabbitMQ or assert exchange:', error);
            channel = null;
            // Implement retry logic for initial connection failure
            setTimeout(connectRabbitMQ, 5000); // Simple retry
        }
    }
    return channel;
}

function getChannel() {
    if (!channel) {
        throw new Error('RabbitMQ channel not established. Call connectRabbitMQ first.');
    }
    return channel;
}

module.exports = { connectRabbitMQ, getChannel, CLEAR_SKY_EVENTS_EXCHANGE };