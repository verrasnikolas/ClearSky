const { findOrCreateCourse, saveInitialGrades, deleteInitialGradesByBatchId, getCourseIdByBatchId, ConditionallyDeleteCourse } = require('../services/InitialGradesService');
const { findCourseId, saveFinalGrades } = require('../services/FinalGradesService');

const handleEvent = async (event, routingKey) => {
    console.log(`--- Grades Service processing event: ${routingKey} ---`);
    console.log(`Batch ID: ${event.batchId}, Course: ${event.courseMeta?.title || event.courseMeta?.name} (${event.courseMeta?.id})`);

    switch (routingKey) {
        case 'grades.initial.uploaded':
        {
            const { courseMeta, gradeEntries } = event; // ExtractedUsersDetails might not be directly used by saveInitialGrades
            const course = await findOrCreateCourse(courseMeta);
            await saveInitialGrades(course.id, gradeEntries, event.batchId);
            console.log(`Grades Service: Initial grades for batch ${event.batchId} saved.`);
            break;
        }

        case 'user.provisioning.batch.failed':
        {
            console.log(`Grades Service: User provisioning FAILED for Batch ID: ${event.batchId}. **Deleting initial grades.**`);
            try {
                // Call the idempotent delete operation
                const courseId = await getCourseIdByBatchId(event.batchId);
                await deleteInitialGradesByBatchId(event.batchId);
                console.log(`[Grades Service] Successfully handled failure for batch ${event.batchId} by deleting initial grades.`);
                if (courseId) {
                    await ConditionallyDeleteCourse(courseId);
                    console.log(`[Grades Service] No more grades for course ${courseId}. Course deleted.`);
                }
            } catch (deleteError) {
                console.error(`[Grades Service] Critical error handling 'user.provisioning.batch.failed' for batch ${batchId}:`, deleteError);
                // DO NOT Acknowledge (nack) the message here if delete fails,
                // so RabbitMQ will re-deliver it for retry.
                throw deleteError; // Re-throw to signal consumer failure and trigger re-delivery
            }
            break;
        }

        case 'grades.final.uploaded':
        {
            const { courseMeta, gradeEntries } = event;
            console.log(`Grades Service: Received FINAL grades upload for Batch ID: ${event.batchId}. Processing final grades.`);
            const courseId = await findCourseId(courseMeta);
            if (!courseId) {
                console.error(`Error: Course not found for courseMeta: ${JSON.stringify(courseMeta)} for batch ${event.batchId}. Cannot save final grades.`);
                throw new Error(`Course not found for batch ${event.batchId}. Cannot save final grades.`);
            }
            await saveFinalGrades(courseId, gradeEntries);
            console.log(`Grades Service: Successfully saved final grades for batch ${event.batchId}.`);
            break;
        }

        default:
            console.warn(`⚠️ Grades Service: Unknown or unhandled routing key: ${routingKey}`);
            break;
    }
};

module.exports = {handleEvent};
