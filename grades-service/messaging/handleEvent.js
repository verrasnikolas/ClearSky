const { findOrCreateCourse, saveInitialGrades } = require('../services/InitialGradesService');

const handleEvent = async (event) => {
    switch (event.type) {
        case 'initial_grades_parsed':{
            const { courseMeta, gradeEntries } = event.data;
            const course = await findOrCreateCourse(courseMeta);
            await saveInitialGrades(course.id, gradeEntries);
            break;
        }
        case 'final_grades_parsed':
            //await processFinalGrades(event.data);
            break;
        default:
            console.warn(`⚠️ Unknown event type: ${event.type}`);
    }
};

module.exports = {handleEvent};
