const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3002;
const { startConsumer } = require('./messaging/startConsumer');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');
const CourseStats = require('./models/courseStats'); // Import the new model

const statsRoutes = require('./routes/statsRoutes');
app.use(express.json());
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
    res.send('Statistics Service is running');
});

async function calculateAndStoreStats(courseMeta, gradeEntries) {
    if (!gradeEntries || gradeEntries.length === 0) {
        console.log(`No grade entries to calculate statistics for ${courseMeta.code} - ${courseMeta.semester}`);
        return;
    }

    const totalGrade = gradeEntries.reduce((sum, entry) => sum + entry.initialGrade, 0);
    const averageGrade = totalGrade / gradeEntries.length;

    const distribution = gradeEntries.reduce((acc, entry) => {
        const grade = Math.round(entry.initialGrade);
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
    }, {});

    try {
        await CourseStats.upsert({ // Use upsert to either create or update if the course and semester already exist
            courseCode: courseMeta.code,
            semester: courseMeta.semester,
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            gradeDistribution: distribution,
        });
        console.log(`Statistics calculated and stored for ${courseMeta.code} - ${courseMeta.semester}`);
    } catch (error) {
        console.error('Error storing statistics:', error);
    }
}

(async () => {
    await connectRabbitMQ();
    await startConsumer(async (event) => { // Make the callback async
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

            await calculateAndStoreStats(courseMeta, gradeEntries); // Calculate and store stats
        }
    });
})();

app.listen(port, () => {
    console.log(`Statistics Service running on port ${port}`);
});