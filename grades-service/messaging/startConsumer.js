// grades-service/messaging/startConsumer.js
const { getChannel, CLEAR_SKY_EVENTS_EXCHANGE } = require('./connectRabbitMQ');

// Define a single, dedicated queue name for the grades-service's main processing
const MY_CONSUMER_QUEUE_NAME = 'grades_service_processing_queue';

async function startConsumer(onEvent) {
    const channel = getChannel();

    // 1. Assert the single durable queue for this service
    await channel.assertQueue(MY_CONSUMER_QUEUE_NAME, { durable: true });
    console.log(`[📦] Asserted durable queue: "${MY_CONSUMER_QUEUE_NAME}"`);

    // 2. Bind the single queue to all relevant topic patterns from the central exchange
    // Grades service needs all these events to manage grade lifecycle and potential rollbacks.
    await channel.bindQueue(MY_CONSUMER_QUEUE_NAME, CLEAR_SKY_EVENTS_EXCHANGE, 'grades.initial.uploaded');
    console.log(`[🔔 Grades Service] Bound "${MY_CONSUMER_QUEUE_NAME}" to "grades.initial.uploaded"`);

    await channel.bindQueue(MY_CONSUMER_QUEUE_NAME, CLEAR_SKY_EVENTS_EXCHANGE, 'grades.final.uploaded');
    console.log(`[🔔 Grades Service] Bound "${MY_CONSUMER_QUEUE_NAME}" to "grades.final.uploaded"`);

    await channel.bindQueue(MY_CONSUMER_QUEUE_NAME, CLEAR_SKY_EVENTS_EXCHANGE, 'user.provisioning.batch.failed');
    console.log(`[🔔 Grades Service] Bound "${MY_CONSUMER_QUEUE_NAME}" to "user.provisioning.batch.failed"`);

    // 3. Set up a single consumer for this queue
    channel.consume(MY_CONSUMER_QUEUE_NAME, (msg) => {
        if (msg.content) {
            const event = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            console.log(`[📥 Grades Service] Received event: "${routingKey}" for batch ${event.batchId}`);
            // The handleEvent function will use the routingKey to dispatch logic
            onEvent(event, routingKey);
            channel.ack(msg); // Acknowledge message after successful processing
        } else {
            console.warn('[⚠️ Grades Service] Received null message content. Acknowledging.');
            channel.ack(msg);
        }
    }, { noAck: false }); // noAck: false means we will manually acknowledge messages

    console.log(`[🔔 Grades Service] Subscribed to "${CLEAR_SKY_EVENTS_EXCHANGE}" via queue "${MY_CONSUMER_QUEUE_NAME}"`);
}

module.exports = { startConsumer, MY_CONSUMER_QUEUE_NAME };