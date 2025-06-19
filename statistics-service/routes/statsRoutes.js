// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticateToken } = require('../middlewares/authToken');

// GET /api/stats/courses/:courseCode/:semester
router.get('/courses/:courseCode/:semester', authenticateToken, statsController.getCourseStats);

// GET /api/stats/courses/:courseCode
router.get('/courses/:courseCode', authenticateToken, statsController.getAllCourseStats);

// GET /api/stats/all-courses
router.get('/all-courses', authenticateToken, statsController.getAllCoursesWithExamPeriods); // New route

module.exports = router;