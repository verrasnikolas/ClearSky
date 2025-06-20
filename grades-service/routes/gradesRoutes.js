const express = require('express');
const router = express.Router();
const { getStudentGradedCourses, getStudentGradeForCourse } = require('../controllers/gradesController');

router.get('/student/', getStudentGradedCourses);
router.get('/student/:courseId', getStudentGradeForCourse);

module.exports = router;
