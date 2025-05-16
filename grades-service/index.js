const express = require('express');
const cors = require('cors');
const gradesRoutes = require('./routes/gradesRoutes');
const db = require('./models');
const { startConsumer, connectRabbitMQ, handleEvent } = require('./messaging/');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use('/api/grades', gradesRoutes);

app.get('/', (req, res) => {
    res.send('Grades Service is running');
});

(async () => {
        await db.sequelize.authenticate();
        console.log('✅ Connected to the database');

        await connectRabbitMQ();
        //await startConsumer((event) => handleEvent(event));  αν θέλουμε να προσθέσουμε
        //                                                     middleware, καλύτερη σύνταξη
        await startConsumer(handleEvent);

        app.listen(port, () => {
            console.log(`🚀 Grades Service running on port ${port}`);
        });
    }
)();


