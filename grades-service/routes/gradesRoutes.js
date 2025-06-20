const express = require('express');
const router = express.Router();
const { getStudentGradedCourses, getStudentGradeForCourse } = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGradedCourses);
router.get('/student/:studentId/course/:courseId', getStudentGradeForCourse);

module.exports = router;
