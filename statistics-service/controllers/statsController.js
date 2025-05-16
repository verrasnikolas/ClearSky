// statsController.js
const { CourseStats } = require('../config/db');

const getCourseStats = async (req, res) => {
    const { courseCode, semester } = req.params;
    try {
        const stats = await CourseStats.findOne({
            where: {
                courseCode: courseCode,
                semester: semester,
            },
        });

        if (!stats) {
            return res.status(404).json({ message: `Statistics not found for course ${courseCode}, semester ${semester}` });
        }

        res.status(200).json({
            averageGrade: stats.averageGrade,
            gradeDistribution: stats.gradeDistribution,
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics.', details: error.message });
    }
};

const getAllCourseStats = async (req, res) => {
    try {
        const allStats = await CourseStats.findAll();

        if (!allStats || allStats.length === 0) {
            return res.status(404).json({ message: 'No statistics found in the database.' });
        }

        res.status(200).json(allStats);
    } catch (error) {
        console.error('Error fetching all statistics:', error);
        res.status(500).json({ error: 'Failed to fetch all statistics.', details: error.message });
    }
};

module.exports = {
    getCourseStats,
    getAllCourseStats
};