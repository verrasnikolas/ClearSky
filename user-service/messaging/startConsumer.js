// user-service/messaging/startConsumer.js
const { getChannel, CLEAR_SKY_EVENTS_EXCHANGE } = require('./connectRabbitMQ');

const MY_CONSUMER_QUEUE_NAME = 'user_service_provisioning_queue'; // Unique queue name for user-service

async function startConsumer(onEvent) {
    const channel = getChannel();
    await channel.assertQueue(MY_CONSUMER_QUEUE_NAME, { durable: true });
    console.log(`[📦] Asserted durable queue: "${MY_CONSUMER_QUEUE_NAME}"`);

    await channel.bindQueue(MY_CONSUMER_QUEUE_NAME, CLEAR_SKY_EVENTS_EXCHANGE, 'grades.initial.uploaded');
    // It DOES NOT bind to 'grades.final.uploaded' - this is correct.

    channel.consume(MY_CONSUMER_QUEUE_NAME, (msg) => {
        if (msg.content) {
            const event = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;

            console.log(`[📥 User Service] Received event: "${routingKey}" for batch ${event.batchId}`);
            onEvent(event, routingKey);
            channel.ack(msg);
        } else {
            console.warn('[⚠️ User Service] Received null message content. Acknowledging.');
            channel.ack(msg);
        }
    }, { noAck: false });

    console.log(`[🔔 User Service] Subscribed to "${CLEAR_SKY_EVENTS_EXCHANGE}" via queue "${MY_CONSUMER_QUEUE_NAME}"`);
}

module.exports = { startConsumer, MY_CONSUMER_QUEUE_NAME };