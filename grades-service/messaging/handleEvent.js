const { findOrCreateCourse, saveInitialGrades } = require('../services/InitialGradesService');
const { findCourseId, saveFinalGrades } = require('../services/FinalGradesService');

const handleEvent = async (event) => {
    switch (event.type) {
        case 'initial_grades_parsed':{
            const { courseMeta, gradeEntries } = event.data;
            const course = await findOrCreateCourse(courseMeta);
            await saveInitialGrades(course.id, gradeEntries);
            break;
        }
        case 'final_grades_parsed':
            const { courseMeta, gradeEntries } = event.data;
            const courseId = await findCourseId(courseMeta);
            if (!courseId) {
                throw new Error(`Course not found for code ${courseMeta.code} (${courseMeta.semester}). Cannot save final grades.`);
            }
            await saveFinalGrades(courseId, gradeEntries);
            break;
        default:
            console.warn(`⚠️ Unknown event type: ${event.type}`);
    }
};

module.exports = {handleEvent};
