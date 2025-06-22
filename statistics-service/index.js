// app.js
const express = require('express');
require('dotenv').config();
const { startConsumer } = require('./messaging/startConsumer');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');
const { handleEvent } = require('./messaging/handleEvent');
const { sequelize } = require('./config/db'); // Import sequelize as well
const statsRoutes = require('./routes/statsRoutes');
const cors = require('cors');

const app = express();
app.use(cors());
const port = process.env.PORT || 3002;
app.use(express.json());

app.use('/', statsRoutes);

app.get('/', (req, res) => {
    res.send('Statistics Service is running');
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');
        await sequelize.sync();
        console.log('✅ Tables synced');

        await connectRabbitMQ();
        await startConsumer(handleEvent);

        app.listen(port, () => {
            console.log(`Statistics Service running on port ${port}`);
        });

    } catch (error) {
        console.error('Error during initialization:', error);
    }
})();