const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadInitialGrades, getStudentGradedCourses, getStudentGradeForCourse } = require('../controllers/gradesController');

router.post(
    '/upload',
    // upload.single('file'),
    uploadInitialGrades
);

router.get('/student/:studentId', getStudentGradedCourses);
router.get('/student/:studentId/course/:courseId', getStudentGradeForCourse);

module.exports = router;
