// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats/courses/:courseCode/:semester
router.get('/courses/:courseCode/:semester', statsController.getCourseStats);

// GET /api/stats/courses/:courseCode
router.get('/courses/:courseCode', statsController.getAllCourseStats);

// GET /api/stats/all-courses
router.get('/all-courses', statsController.getAllCoursesWithExamPeriods); // New route

module.exports = router;