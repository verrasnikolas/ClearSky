const express = require('express');
const cors = require('cors');
const gradesRoutes = require('./routes/gradesRoutes');
const db = require('./models');
const { startConsumer, connectRabbitMQ, handleEvent } = require('./messaging/');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use('/', gradesRoutes);

app.get('/', (req, res) => {
    res.send('Grades Service is running');
});

(async () => {
        await db.sequelize.authenticate();
        console.log('✅ Connected to DB');
        await db.sequelize.sync();
        console.log('✅ Tables synced');

        await connectRabbitMQ();
        //await startConsumer((event) => handleEvent(event));  αν θέλουμε να προσθέσουμε
        //                                                     middlewares, καλύτερη σύνταξη
        await startConsumer(handleEvent);

        app.listen(port, () => {
            console.log(`🚀 Grades Service running on port ${port}`);
        });
    }
)();


