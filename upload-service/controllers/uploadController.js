const parseExcel = require('../services/excelParser');
const {publish} = require('../messaging/eventPublisher');
const { INITIAL_GRADES_PARSED } = require('../events/eventTypes');

const uploadInitialGrades = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const { courseMeta, gradeEntries, extractedUsers, skippedRows } = parseExcel(file);

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

module.exports = {
    uploadInitialGrades
};