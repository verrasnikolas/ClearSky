const axios = require('axios');
const config = require('../config/config');

const calculateCourseStats = async (req, res) => {
    const { courseCode, semester } = req.params;
    const gradesServiceUrl = `${config.gradesServiceUrl}/`; // Adjust endpoint if needed

    try {
        // 1. Fetch all grades for all students in the specified course
        const response = await axios.get(`${gradesServiceUrl}/`); // Assuming your grades service returns all grades. You might need to adjust this endpoint or filter on the grades service.

        if (!response.data || !Array.isArray(response.data)) {
            const errorMessage = 'No grades data received from the grades service.';
            console.error(errorMessage);
            return res.status(404).json({ error: errorMessage });
        }

        // Filter grades for the specific course (assuming each grade entry has course information)
        const courseGrades = response.data.filter(gradeEntry =>
            gradeEntry.course.code === courseCode && gradeEntry.course.semester === semester && gradeEntry.final_grade !== null && gradeEntry.final_grade !== undefined
        );

        if (courseGrades.length === 0) {
            const errorMessage = `No grades found for course ${courseCode}, semester ${semester}.`;
            console.error(errorMessage);
            return res.status(404).json({ error: errorMessage });
        }

        // 2. Calculate the average grade
        const totalGrade = courseGrades.reduce((sum, entry) => sum + entry.final_grade, 0);
        const averageGrade = totalGrade / courseGrades.length;

        // 3. Calculate the grade distribution
        const distribution = courseGrades.reduce((acc, entry) => {
            const grade = Math.round(entry.final_grade); // Round to the nearest integer for distribution
            acc[grade] = (acc[grade] || 0) + 1;
            return acc;
        }, {});

        res.status(200).json({
            averageGrade: parseFloat(averageGrade.toFixed(2)),
            gradeDistribution: distribution
        });

    } catch (error) {
        console.error('Error fetching grades:', error.message); // Log the specific error message
        // Optionally, you can log the entire error object for more details:
        console.error('Error fetching grades:', error);

        // Consider what information to send back in the response.
        // In production, you might want to send a generic error message to avoid exposing internal details.
        // res.status(500).json({ error: 'Failed to fetch and calculate statistics.', details: error.message });
        // Or, for development/debugging, you could send more details:
        res.status(500).json({ error: 'Failed to fetch and calculate statistics.', details: error.stack });
    }
};

module.exports = {
    calculateCourseStats
};