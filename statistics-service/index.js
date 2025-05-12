const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3004;

// fix this when i have a port
const GRADES_SERVICE_URL = process.env.GRADES_SERVICE_URL || 'http://grades-service:3001';

app.get('/api/statistics/student/:studentId/average', async (req, res) => {
    const { studentId } = req.params;

    try {
        const response = await axios.get(`${GRADES_SERVICE_URL}/api/grades/${studentId}`);
        const grades = response.data;

        if (!grades.length) {
            return res.status(404).json({ message: 'No grades found for this student.' });
        }

        const total = grades.reduce((sum, g) => sum + g.initial_grade, 0);
        const average = total / grades.length;

        res.json({ studentId, averageGrade: average.toFixed(2) });
    } catch (error) {
        console.error('Error fetching student grades:', error.message);
        res.status(500).json({ error: 'Failed to calculate student average grade' });
    }
});

app.get('/api/statistics/course/:courseId/average', async (req, res) => {
    const { courseId } = req.params;

    try {
        const response = await axios.get(`${GRADES_SERVICE_URL}/api/grades/course/${courseId}`);
        const grades = response.data;

        if (!grades.length) {
            return res.status(404).json({ message: 'No grades found for this course.' });
        }

        const total = grades.reduce((sum, g) => sum + g.initial_grade, 0);
        const average = total / grades.length;

        res.json({ courseId, averageGrade: average.toFixed(2) });
    } catch (error) {
        console.error('Error fetching course grades:', error.message);
        res.status(500).json({ error: 'Failed to calculate course average grade' });
    }
});

app.listen(port, () => {
    console.log(`📊 Statistics Service is running on port ${port}`);
});
