const parseExcel = require('../services/excelParser');
const {publish} = require('../messaging/eventPublisher');
const { INITIAL_GRADES_PARSED, FINAL_GRADES_PARSED } = require('../events/eventTypes');

const uploadInitialGrades = async (req, res) => {
    console.log('[DEBUG] req.user:', req.user);
    console.log('[BACKEND] Content-Type:', req.headers['content-type']);
    console.log('[BACKEND] req.file:', req.file);
    console.log('[BACKEND] req.body:', req.body);

    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const instructorId = req.body.instructor_id;
        const { courseMeta, gradeEntries, extractedUsers, skippedRows } = parseExcel(file, instructorId);

        // Publish event to broker (RabbitMQ/NATS etc)
        publish(INITIAL_GRADES_PARSED, {
            courseMeta,
            gradeEntries,
            extractedUsers,
        });

        res.status(200).json({
            message: 'Excel uploaded and event emitted',
            uploaded: gradeEntries.length,
            skipped: skippedRows.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process upload' });
    }
};

const uploadFinalGrades = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const instructorId = req.body.instructor_id;
        const { courseMeta, gradeEntries } = parseExcel(file, instructorId);

        publish(FINAL_GRADES_PARSED, {
            courseMeta,
            gradeEntries
        });

        res.status(200).json({
            message: 'Excel uploaded and event emitted',
            uploaded: gradeEntries.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process upload' });
    }
};

module.exports = {
    uploadInitialGrades,
    uploadFinalGrades
};