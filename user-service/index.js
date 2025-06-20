require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database.js');
const app = express();
const cors = require('cors');
const { startConsumer, connectRabbitMQ, handleEvent } = require('./messaging/');

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3005;
(async () => {

    await sequelize.authenticate();
    console.log('✅ Connected to DB');
    await sequelize.sync();
    console.log('✅ Tables synced');

    await connectRabbitMQ();

    await startConsumer(handleEvent);

    app.listen(PORT, () => {
        console.log(`🚀 User Service running on port ${PORT}`);
    });
})();
