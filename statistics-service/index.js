const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3003;
const { startConsumer } = require('./messaging/eventSubscriber');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');

const statisticsRoutes = require('./routes/statisticsRoutes');
const sequelize = require('./config/db');

app.use(express.json());
app.use('/api/statistics', statisticsRoutes);

(async () => {
    await connectRabbitMQ();
    await startConsumer((event) => {
        if (event.type === 'initial_grades_parsed') {
            const { courseMeta, gradeEntries } = event.data;

            console.log('\n Received Event: initial_grades_parsed');
            console.log('------------------------------------------');
            console.log('📘 Course Metadata:');
            console.log(JSON.stringify(courseMeta, null, 2));

            console.log('\n Grade Entries:');
            gradeEntries.forEach((g, index) => {
                console.log(`  #${index + 1} | Student ID: ${g.studentId}, Grade: ${g.initialGrade}`);
                console.log(`     Questions: ${JSON.stringify(g.questionGrades)}`);
            });
        }
    });
})();

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log(`✅ Connected to PostgreSQL`);
        console.log(`✅ Statistics Service running on port ${port}`);
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
});
