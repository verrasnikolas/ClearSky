const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET /api/stats/courses/:courseCode/:semester
router.get('/courses/:courseCode/:semester', statsController.getCourseStats); // Changed to getCourseStats

module.exports = router;