const { startConsumer } = require('./startConsumer');
const { connectRabbitMQ } = require('./connectRabbitMQ');
const { handleEvent } = require('./handleEvent');

module.exports = {
    startConsumer,
    connectRabbitMQ,
    handleEvent
};
