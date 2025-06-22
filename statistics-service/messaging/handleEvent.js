const { CourseStats } = require('../config/db'); // Import sequelize as well

async function calculateAndStoreStats(courseMeta, gradeEntries) {
    if (!gradeEntries || gradeEntries.length === 0) {
        console.log(`No grade entries to calculate statistics for ${courseMeta.code} - ${courseMeta.semester}`);
        return;
    }

    const totalGrade = gradeEntries.reduce((sum, entry) => sum + entry.grade, 0);
    const averageGrade = totalGrade / gradeEntries.length;

    const gradeDistribution = gradeEntries.reduce((acc, entry) => {
        const grade = Math.round(entry.grade);
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

    // Calculate pass/not_pass counts
    const passCount = gradeEntries.filter(entry => entry.grade >= 5).length;
    const notPassCount = gradeEntries.length - passCount;


    try {
        await CourseStats.upsert({
            courseCode: courseMeta.code,
            courseName: courseMeta.title,
            semester: courseMeta.semester,
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            gradeDistribution: gradeDistribution,
            questionAverages: questionAverages,
            questionDistributions: questionDistributions,
            passCount: passCount,  // Store the pass count
            notPassCount: notPassCount, // Store the not pass count
        });
        console.log(`Statistics calculated and stored for ${courseMeta.code} - ${courseMeta.semester}`);
    } catch (error) {
        console.error('Error storing statistics:', error);
    }
}

/**
 * Handles incoming events for the stats-service, triggered by RabbitMQ messages.
 * @param {Object} event - The parsed event object from RabbitMQ.
 * Properties like `batchId`, `courseMeta`, `gradeEntries` (for grade events)
 * are now directly on the `event` object, not `event.data`.
 * @param {string} routingKey - The routing key (topic) of the received event.
 */
const handleEvent = async (event, routingKey) => {
    console.log(`--- Stats Service processing event: ${routingKey} ---`);
    console.log(`Batch ID: ${event.batchId}, Course: ${event.courseMeta?.title || event.courseMeta?.name} (${event.courseMeta?.id})`);

    switch (routingKey) {
        case 'grades.initial.uploaded':
        {
            // As per project requirement, calculate initial statistics immediately.
            // This will use your existing `calculateAndStoreStats` which performs an UPSERT.
            const { courseMeta, gradeEntries } = event;
            console.log(`Stats Service: Received initial upload for Batch ID: ${event.batchId}. Calculating initial statistics.`);
            console.log('\n Grade Entries:');
            gradeEntries.forEach((g, index) => {
                console.log(`  #${index + 1} | Student ID: ${g.studentId}, Grade: ${g.grade}`);
                console.log(`     Questions: ${JSON.stringify(g.questionGrades)}`);
            });
            await calculateAndStoreStats(courseMeta, gradeEntries);
            break;
        }
        case 'grades.final.uploaded':
        {
            const { courseMeta, gradeEntries } = event;
            console.log(`Stats Service: Received FINAL grades upload for Batch ID: ${event.batchId}. Updating final statistics.`);
            console.log('\n Grade Entries:');
            gradeEntries.forEach((g, index) => {
                console.log(`  #${index + 1} | Student ID: ${g.studentId}, Grade: ${g.grade}`);
                console.log(`     Questions: ${JSON.stringify(g.questionGrades)}`);
            });
            await calculateAndStoreStats(courseMeta, gradeEntries);
            break;
        }

        default:
            console.warn(`⚠️ Stats Service: Unknown or unhandled routing key: ${routingKey}`);
            break;
    }
};

module.exports = { handleEvent };
