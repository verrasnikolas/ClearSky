const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const sequelize = require('./config/db');
const reviewRoutes = require('./routes/reviewRoute');
const errorHandler = require('./middlewares/ErrorHandler');

app.use(express.json());
app.use('/api/reviews', reviewRoutes);
app.use(errorHandler); // Must be last

app.listen(3003, '0.0.0.0', () => {
    console.log('ReviewService running on port 3003');
});


//use sequelize
sequelize.sync().then(() => {
    app.listen(3003, () => {
        console.log('ReviewService running on port 3003');
    });

});
