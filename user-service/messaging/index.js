// user-service/messaging/index.js
const { connectRabbitMQ } = require('./connectRabbitMQ');
const { startConsumer } = require('./startConsumer');
const { handleEvent } = require('./handleEvent'); // Assuming handleEvent.js is present in messaging/

module.exports = {
    connectRabbitMQ,
    startConsumer,
    handleEvent,
};