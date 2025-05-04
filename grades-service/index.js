// grades-service/index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const gradesRoutes = require('./routes/gradesRoutes');
const pool = require('./config/db');

app.use(express.json());
app.use('/api/grades', gradesRoutes);

app.get('/', (req, res) => {
    res.send('Grades Service is running');
});

app.listen(port, () => {
    console.log(`Grades Service running on port ${port}`);
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ Error connecting to PostgreSQL:', err);
    } else {
        console.log('✅ Connected to PostgreSQL at:', res.rows[0].now);
    }
});
