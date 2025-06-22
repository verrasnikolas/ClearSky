// This file will likely be something like upload-service/controllers/gradesController.js
// or upload-service/handlers/gradesUploadHandler.js

const parseExcel = require('../services/excelParser');
const excelValidator = require('../services/excelValidator');
// --- OLD: const {publish} = require('../messaging/eventPublisher');
// --- OLD: const { INITIAL_GRADES_PARSED, FINAL_GRADES_PARSED } = require('../events/eventTypes');

// >>> NEW: Import our unified publisher function <<<
const { publishGradesUpload } = require('../messaging/eventPublisher');
// You no longer need eventTypes, as the type ('initial'/'final') is passed directly


const confirmCourse = async (req, res) => {
    console.log('[DEBUG] req.user:', req.user);
    console.log('[BACKEND] Content-Type:', req.headers['content-type']);
    console.log('[BACKEND] req.file:', req.file);
    console.log('[BACKEND] req.body:', req.body)

    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: 'No file uploaded' });

        const courseMeta = excelValidator(file);

        res.status(200).json({
            message: 'Preview successful',
            courseMeta
        });

    } catch (err) {
        console.error('[PREVIEW ERROR]', err);
        res.status(400).json({ error: err.message });
    }
};


const uploadInitialGrades = async (req, res) => {
    console.log('[DEBUG] req.user:', req.user);
    console.log('[BACKEND] Content-Type:', req.headers['content-type']);
    console.log('[BACKEND] req.file:', req.file);
    console.log('[BACKEND] req.body:', req.body);

    try {
        const instructorId = req.headers['x-user-id'];
        const file = req.file;
        const { courseMeta, gradeEntries, extractedUsers, skippedRows } = parseExcel(file, instructorId);

        // --- NEW: Generate a unique batchId and correlationId for this operation ---
        // CorrelationId can come from request headers for tracing user requests
        const batchId = `initial-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const correlationId = req.headers['x-correlation-id'] || `corr-${Date.now()}`;

        // --- OLD: publish(INITIAL_GRADES_PARSED, { courseMeta, gradeEntries, extractedUsers }); ---
        // >>> NEW: Call our unified publishGradesUpload function with 'initial' type <<<
        await publishGradesUpload(
            'initial',      // Specify the type of upload
            batchId,        // The new unique batch ID
            courseMeta,
            gradeEntries,
            extractedUsers, // extractedUsers is relevant for initial grades
            correlationId   // The correlation ID for tracing
        );

        res.status(200).json({
            message: 'Excel uploaded and event emitted',
            course: courseMeta?.title || 'Unknown Course',
            period: courseMeta?.semester || 'Unknown Period',
            count: gradeEntries.length,
            batchId: batchId, // Return batchId to frontend for status tracking
            correlationId: correlationId // Return correlationId for tracing
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process upload' });
    }
};

const uploadFinalGrades = async (req, res) => {
    try {
        const instructorId = req.headers['x-user-id'];
        const file = req.file;
        const { courseMeta, gradeEntries } = parseExcel(file, instructorId);

        // --- NEW: Generate a unique batchId and correlationId for this operation ---
        const batchId = `final-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const correlationId = req.headers['x-correlation-id'] || `corr-${Date.now()}`;

        // --- OLD: publish(FINAL_GRADES_PARSED, { courseMeta, gradeEntries }); ---
        // >>> NEW: Call our unified publishGradesUpload function with 'final' type <<<
        await publishGradesUpload(
            'final',        // Specify the type of upload
            batchId,        // The new unique batch ID
            courseMeta,
            gradeEntries,
            [],             // extractedUsers is not typically relevant for final grades upload, so pass empty array
            correlationId   // The correlation ID for tracing
        );

        res.status(200).json({
            message: 'Excel uploaded and event emitted',
            course: courseMeta?.title || 'Unknown Course',
            period: courseMeta?.semester || 'Unknown Period',
            count: gradeEntries.length,
            batchId: batchId, // Return batchId to frontend
            correlationId: correlationId // Return correlationId
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process upload' });
    }
};

module.exports = {
    uploadInitialGrades,
    uploadFinalGrades,
    confirmCourse
};