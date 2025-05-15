const { getChannel } = require('./connectRabbitMQ');
const exchangeName = 'grades_exchange';

function publish(eventType, payload) {
    const channel = getChannel(); // 🟢 Παίρνεις το shared channel

    const message = Buffer.from(JSON.stringify({
        type: eventType,
        data: payload,
        timestamp: new Date().toISOString()
    }));

    channel.publish(exchangeName, '', message);
    console.log(`[📤] Event "${eventType}" published`);
}

module.exports = {
    publish
};
