// app.js
const express = require('express');
require('dotenv').config();
const app = express();

const cors = require('cors');
app.use(cors());

const port = process.env.PORT || 3002;
const { startConsumer } = require('./messaging/startConsumer');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');
const { sequelize, CourseStats } = require('./config/db'); // Import sequelize as well
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

    const gradeDistribution = gradeEntries.reduce((acc, entry) => {
        const grade = Math.round(entry.initialGrade);
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
    }, {});

    // Calculate average score per question and distribution
    const questionAverages = {};
    const questionDistributions = {};
    if (gradeEntries.length > 0 && gradeEntries[0].questionGrades) {
        const firstEntryQuestions = Object.keys(gradeEntries[0].questionGrades);
        firstEntryQuestions.forEach(question => {
            const totalScore = gradeEntries.reduce((sum, entry) => (entry.questionGrades && entry.questionGrades[question] !== undefined ? sum + entry.questionGrades[question] : sum), 0);
            questionAverages[question] = parseFloat((totalScore / gradeEntries.length).toFixed(2));

            questionDistributions[question] = gradeEntries.reduce((acc, entry) => {
                const score = entry.questionGrades ? entry.questionGrades[question] : undefined;
                if (score !== undefined) {
                    acc[score] = (acc[score] || 0) + 1;
                }
                return acc;
            }, {});
        });
    }

    try {
        await CourseStats.upsert({
            courseCode: courseMeta.code,
            courseName: courseMeta.title, // Assuming courseMeta.title is the course name
            semester: courseMeta.semester,
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            gradeDistribution: gradeDistribution,
            questionAverages: questionAverages, // Store the average question scores
            questionDistributions: questionDistributions, // Store the question distributions
        });
        console.log(`Statistics calculated and stored for ${courseMeta.code} - ${courseMeta.semester}`);
    } catch (error) {
        console.error('Error storing statistics:', error);
    }
}

(async () => {
    try {
        await sequelize.sync();
        console.log('Database synchronized successfully.');

        await connectRabbitMQ();
        await startConsumer(async (event) => {
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

                await calculateAndStoreStats(courseMeta, gradeEntries);
            }
        });

        app.listen(port, () => {
            console.log(`Statistics Service running on port ${port}`);
        });

    } catch (error) {
        console.error('Error during initialization:', error);
    }
})();