
// POST /api/grades/upload
const XLSX = require('xlsx');
const path = require('path');

const uploadInitialGrades = (req, res) => {
    const courseMeta = req.courseMeta;

    if (!courseMeta) {
        return res.status(400).json({ error: 'Course metadata not found' });
    }

    return res.status(200).json({
        message: 'Excel file validated successfully!',
        extractedCourseInfo: courseMeta
    });
};



// GET /api/grades/
const getGrades = async (req, res) => {
    try {

        res.status(200).json(grades);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports = { uploadInitialGrades, getGrades };
