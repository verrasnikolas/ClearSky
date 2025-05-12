const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3003;

const statisticsRoutes = require('./routes/statisticsRoutes');
const sequelize = require('./config/db');

app.use(express.json());
app.use('/api/statistics', statisticsRoutes);

app.get('/', (req, res) => {
    res.send('Statistics Service is running');
});

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Connected to PostgreSQL`);
        console.log(`✅ Statistics Service running on port ${port}`);
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
});
