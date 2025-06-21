const express = require('express');
const router = express.Router();
const { getStudentGradedCourses, getStudentGradeForCourse , getCoursesByInstructor, getCourseDetailsById} = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGradedCourses);
router.get('/student/:studentId/course/:courseId', getStudentGradeForCourse);

router.get('/instructor/:instructorId/courses', getCoursesByInstructor);

router.get('/courses/:courseId', getCourseDetailsById);

module.exports = router;
