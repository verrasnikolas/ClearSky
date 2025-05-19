require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database.js');
const app = express();

const cors = require('cors');
app.use(cors());

app.use(express.json());



const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
});

// 👉 Messaging setup
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');
const { startConsumer } = require('./messaging/startConsumer');
const { addUsersFromExcel } = require('./services/addUsersFromExcel');

// DB Connection
sequelize.authenticate()
    .then(() => {
        console.log('Connected to DB');
        return sequelize.sync();
    })
    .then(() => console.log('Tables synced'))
    .catch(err => console.error('DB Connection Error:', err));

// Start consuming messages
(async () => {
    await connectRabbitMQ();
    await startConsumer(async (event) => {
        if (event.type === 'initial_grades_parsed') {
            const { extractedUsers } = event.data;
            await addUsersFromExcel(extractedUsers);
        }
    });
})();
