const express = require('express');
const { startConsumer } = require('./messaging/eventSubscriber');
const { connectRabbitMQ } = require('./messaging/connectRabbitMQ');

const port = process.env.PORT || 3007;
const app = express();
app.use(express.json());

(async () => {
    await connectRabbitMQ();
    await startConsumer((event) => {
        if (event.type === 'initial_grades_parsed') {
            const { courseMeta, gradeEntries, extractedUsers } = event.data;

            console.log('\n[📥] Received Event: initial_grades_parsed');
            console.log('------------------------------------------');
            console.log('📘 Course Metadata:');
            console.log(JSON.stringify(courseMeta, null, 2));

            console.log('\n📝 Grade Entries:');
            gradeEntries.forEach((g, index) => {
                console.log(`  #${index + 1} | Student ID: ${g.studentId}, Grade: ${g.initialGrade}`);
                console.log(`     Questions: ${JSON.stringify(g.questionGrades)}`);
            });

            console.log('\n👥 Extracted Users:');
            extractedUsers.forEach((u, index) => {
                console.log(`  #${index + 1} | ${u.id} - ${u.name} (${u.email})`);
            });

            console.log('------------------------------------------\n');
        }
    });

    app.listen(port, () => {
        console.log(`InitialGradeService running on port ${port}`);
    });
})();
