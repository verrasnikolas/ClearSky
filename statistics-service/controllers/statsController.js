// statsController.js
const { CourseStats } = require('../config/db');
const { Op } = require('sequelize');

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
    const { courseCode } = req.params;
    try {
        const allStats = await CourseStats.findAll({
            where: {
                courseCode: courseCode,
            },
        });

        if (!allStats || allStats.length === 0) {
            return res.status(404).json({ message: `No statistics found for course ${courseCode}.` });
        }

        res.status(200).json(allStats);
    } catch (error) {
        console.error(`Error fetching statistics for course ${courseCode}:`, error);
        res.status(500).json({ error: `Failed to fetch statistics for course ${courseCode}.`, details: error.message });
    }
};

const getAllCoursesWithExamPeriods = async (req, res) => {
    try {
        // Find all unique combinations of courseCode and semester
        const coursesWithExamPeriods = await CourseStats.findAll({
            attributes: ['courseCode', 'semester'], // Select both courseCode and semester
            group: ['courseCode', 'semester'],      // Group by both fields for unique combinations
        });

        if (!coursesWithExamPeriods || coursesWithExamPeriods.length === 0) {
            return res.status(404).json({ message: 'No course statistics found.' });
        }

        // Format the results as an array of objects
        const courseExamPeriods = coursesWithExamPeriods.map(item => ({
            courseCode: item.courseCode,
            examPeriod: item.semester, // Renamed 'semester' to 'examPeriod' for clarity
        }));

        res.status(200).json(courseExamPeriods);
    } catch (error) {
        console.error('Error fetching courses with exam periods:', error);
        res.status(500).json({ error: 'Failed to fetch courses with exam periods.', details: error.message });
    }
};

module.exports = {
    getCourseStats,
    getAllCourseStats,
    getAllCoursesWithExamPeriods // Export the new function
};