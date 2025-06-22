// user-service/messaging/publishEvent.js
const { getChannel, CLEAR_SKY_EVENTS_EXCHANGE } = require('./connectRabbitMQ');

async function publishEvent(routingKey, eventPayload) {
    const channel = getChannel();
    // Ensure the exchange exists before publishing to it
    await channel.assertExchange(CLEAR_SKY_EVENTS_EXCHANGE, 'topic', { durable: true });

    try {
        const message = JSON.stringify(eventPayload);
        channel.publish(CLEAR_SKY_EVENTS_EXCHANGE, routingKey, Buffer.from(message));
        console.log(`[📤 User Service] Published event: "${routingKey}" with payload:`, eventPayload);
    } catch (err) {
        console.error(`[🚨 User Service] Failed to publish event "${routingKey}":`, err);
    }
}

module.exports = {
    publishEvent
};