// controllers/grades-controller.js
const gradesService = require('../services/grades-service');

const uploadInitialGrades = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const response = await gradesService.uploadGrades(req.file.buffer); // send file's buffer

        // Ανάλογα με την απάντηση από το grades-service, στέλνουμε την κατάλληλη απάντηση στον client
        res.status(response.status || 200).json(response.data);

    } catch (error) {
        next(error);
    }
};

module.exports = { uploadInitialGrades };