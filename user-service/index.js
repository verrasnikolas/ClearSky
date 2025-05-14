require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const app = express();

app.use(express.json());

// DB Connection & Sync
sequelize.authenticate()
    .then(() => {
        console.log('Connected to DB');
        return sequelize.sync();
    })
    .then(() => console.log('Tables synced'))
    .catch(err => console.error('DB Connection Error:', err));

app.get('/', (req, res) => {
    res.send('User Service is running');
});

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`🚀 User Service running on port ${PORT}`);
});
