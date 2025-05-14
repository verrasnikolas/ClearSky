const { getChannel } = require('./connectRabbitMQ');
const exchangeName = 'grades_exchange';

async function startConsumer(onEvent) {
    const channel = getChannel();
    await channel.assertExchange(exchangeName, 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, exchangeName, '');

    channel.consume(q.queue, (msg) => {
        const event = JSON.parse(msg.content.toString());
        onEvent(event);
    }, { noAck: true });

    console.log(`[🔔] Subscribed to "${exchangeName}"`);
}

module.exports = { startConsumer };
