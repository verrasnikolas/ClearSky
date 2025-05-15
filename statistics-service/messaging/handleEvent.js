
const handleEvent = async (event) => {
    switch (event.type) {
        case 'initial_grades_parsed':
            //await processInitialGrades(event.data);
            break;
        case 'final_grades_parsed':
            //await processFinalGrades(event.data);
            break;
        default:
            console.warn(`⚠️ Unknown event type: ${event.type}`);
    }
};
