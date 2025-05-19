// statsController.js
const { CourseStats } = require('../config/db');
const { Grade } = require('../models/Grade'); // Import the Grade model
const { Sequelize, Op } = require('sequelize');

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

        // Fetch and aggregate question statistics
        const questionStats = await Grade.findAll({
            attributes: [
                // Use Sequelize.literal to dynamically calculate averages for each question
                Sequelize.literal('jsonb_object_keys(questions) AS question'),
                Sequelize.literal('AVG((questions->>jsonb_object_keys(questions))::numeric) AS averageScore'),
            ],
            where: {
                course: courseCode, // Assuming 'course' in Grade matches 'courseCode' in CourseStats
            },
            group: Sequelize.literal('jsonb_object_keys(questions)') , // Group by question
            raw: true, // Get plain JSON results
        });

        res.status(200).json({
            averageGrade: stats.averageGrade,
            gradeDistribution: stats.gradeDistribution,
            questionStatistics: questionStats, // Add the question statistics
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
            attributes: ['courseCode', 'courseName', 'semester'],
            group: ['courseCode', 'courseName', 'semester'],
        });

        if (!coursesWithExamPeriods || coursesWithExamPeriods.length === 0) {
            return res.status(404).json({ message: 'No course statistics found.' });
        }

        const courseExamPeriods = coursesWithExamPeriods.map(item => ({
            courseCode: item.courseCode,
            courseName: item.courseName,
            examPeriod: item.semester,
        }));

        res.status(200).json(courseExamPeriods);
    } catch (error) {
        console.error('Error fetching courses with exam periods and names:', error);
        res.status(500).json({ error: 'Failed to fetch courses with exam periods and names.', details: error.message });
    }
};

// New function to create course statistics
const createCourseStats = async (req, res) => {
    try {
        const { courseCode, courseName, semester, averageGrade, gradeDistribution } = req.body;

        const newStats = await CourseStats.create({
            courseCode,
            courseName,
            semester,
            averageGrade,
            gradeDistribution,
        });

        res.status(201).json({ message: 'Course statistics created successfully.', data: newStats });
    } catch (error) {
        console.error('Error creating course statistics:', error);
        res.status(500).json({ error: 'Failed to create course statistics.', details: error.message });
    }
};

// New function to update existing course statistics
const updateCourseStats = async (req, res) => {
    const { courseCode, semester } = req.params;
    try {
        const { courseName, averageGrade, gradeDistribution } = req.body;

        const [updatedRows] = await CourseStats.update(
            { courseName, averageGrade, gradeDistribution },
            {
                where: {
                    courseCode: courseCode,
                    semester: semester,
                },
            }
        );

        if (updatedRows > 0) {
            const updatedStats = await CourseStats.findOne({
                where: {
                    courseCode: courseCode,
                    semester: semester,
                },
            });
            res.status(200).json({ message: 'Course statistics updated successfully.', data: updatedStats });
        } else {
            res.status(404).json({ message: `Statistics not found for course ${courseCode}, semester ${semester}` });
        }
    } catch (error) {
        console.error('Error updating course statistics:', error);
        res.status(500).json({ error: 'Failed to update course statistics.', details: error.message });
    }
};

// New function to delete course statistics
const deleteCourseStats = async (req, res) => {
    const { courseCode, semester } = req.params;
    try {
        const deletedRows = await CourseStats.destroy({
            where: {
                courseCode: courseCode,
                semester: semester,
            },
        });

        if (deletedRows > 0) {
            res.status(200).json({ message: `Statistics for course ${courseCode}, semester ${semester} deleted successfully.` });
        } else {
            res.status(404).json({ message: `Statistics not found for course ${courseCode}, semester ${semester}` });
        }
    } catch (error) {
        console.error('Error deleting course statistics:', error);
        res.status(500).json({ error: 'Failed to delete course statistics.', details: error.message });
    }
};

module.exports = {
    getCourseStats,
    getAllCourseStats,
    getAllCoursesWithExamPeriods,
};