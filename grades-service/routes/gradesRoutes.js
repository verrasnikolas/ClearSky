const express = require('express');
const router = express.Router();
const { getStudentGradedCourses, getStudentGradeForCourse , getCoursesByInstructor, getCourseById} = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGradedCourses);
router.get('/student/:studentId/course/:courseId', getStudentGradeForCourse);
router.get('/instructor/courses', getCoursesByInstructor);
router.get('/course/:courseId', getCourseById);

module.exports = router;
