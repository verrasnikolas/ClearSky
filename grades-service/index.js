const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 3001;

const gradesRoutes = require('./routes/gradesRoutes');
const db = require('./models');


app.use(express.json());
app.use('/api/grades', gradesRoutes);




app.get('/', (req, res) => {
    res.send('Grades Service is running');
});

db.sequelize.authenticate()
    .then(() => {
        console.log('✅ Connected to the database');
        app.listen(port, () => {
            console.log('Grades Service running on port ${port}');
        });
    })
    .catch(err => {
        console.error('❌ Unable to connect to the database:', err);
    });