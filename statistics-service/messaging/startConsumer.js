// stats-service/messaging/startConsumer.js
const { getChannel, CLEAR_SKY_EVENTS_EXCHANGE } = require('./connectRabbitMQ');

const MY_CONSUMER_QUEUE_NAME = 'stats_service_processing_queue'; // Unique queue name for stats-service

async function startConsumer(onEvent) {
    const channel = getChannel();
    await channel.assertQueue(MY_CONSUMER_QUEUE_NAME, { durable: true });
    console.log(`[📦] Asserted durable queue: "${MY_CONSUMER_QUEUE_NAME}"`);

    // Stats service consumes:
    // - Initial grades upload (if needed for early stats/reporting, or just to know a batch started)
    // - Final grades uploaded (to trigger final statistics calculation)
    await channel.bindQueue(MY_CONSUMER_QUEUE_NAME, CLEAR_SKY_EVENTS_EXCHANGE, 'grades.initial.uploaded');
    console.log(`[🔔 Stats Service] Bound "${MY_CONSUMER_QUEUE_NAME}" to "grades.initial.uploaded"`);

    await channel.bindQueue(MY_CONSUMER_QUEUE_NAME, CLEAR_SKY_EVENTS_EXCHANGE, 'grades.final.uploaded');
    console.log(`[🔔 Stats Service] Bound "${MY_CONSUMER_QUEUE_NAME}" to "grades.final.uploaded"`);


    channel.consume(MY_CONSUMER_QUEUE_NAME, (msg) => {
        if (msg.content) {
            const event = JSON.parse(msg.content.toString());
            const routingKey = msg.fields.routingKey;
            console.log(`[📥 Stats Service] Received event: "${routingKey}" for batch ${event.batchId}`);
            onEvent(event, routingKey);
            channel.ack(msg);
        } else {
            console.warn('[⚠️ Stats Service] Received null message content. Acknowledging.');
            channel.ack(msg);
        }
    }, { noAck: false });

    console.log(`[🔔 Stats Service] Subscribed to "${CLEAR_SKY_EVENTS_EXCHANGE}" via queue "${MY_CONSUMER_QUEUE_NAME}"`);
}

module.exports = { startConsumer, MY_CONSUMER_QUEUE_NAME };