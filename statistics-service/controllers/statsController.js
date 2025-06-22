// controllers/statsController.js
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
            questionAverages: stats.questionAverages,
            questionDistributions: stats.questionDistributions,
            passCount: stats.passCount,       // Include pass count in response
            notPassCount: stats.notPassCount, // Include not pass count in response
            updatedAt: stats.updatedAt,
            createdAt: stats.createdAt
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
        const coursesWithExamPeriods = await CourseStats.findAll({
            attributes: ['courseCode', 'courseName', 'semester', 'createdAt', 'updatedAt'],
            group: ['courseCode', 'courseName', 'semester','createdAt', 'updatedAt'],
        });

        const courseExamPeriods = coursesWithExamPeriods.map(item => ({
            courseCode: item.courseCode,
            courseName: item.courseName,
            examPeriod: item.semester,
            initialDate: item.createdAt,
            finalDate: item.updatedAt

        }));

        res.status(200).json(courseExamPeriods);
    } catch (error) {
        console.error('Error fetching courses with exam periods and names:', error);
        res.status(500).json({ error: 'Failed to fetch courses with exam periods and names.', details: error.message });
    }
};

module.exports = {
    getCourseStats,
    getAllCourseStats,
    getAllCoursesWithExamPeriods,
};