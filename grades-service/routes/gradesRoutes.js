const express = require('express');
const router = express.Router();
const { getStudentGradedCourses, getStudentGradeForCourse , getCoursesByInstructor} = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGradedCourses);
router.get('/student/:studentId/course/:courseId', getStudentGradeForCourse);

router.get('/instructor/:instructorId/courses', getCoursesByInstructor);

module.exports = router;
