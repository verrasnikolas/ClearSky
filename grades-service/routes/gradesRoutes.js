const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadInitialGrades, getStudentGradedCourses, getStudentGradeForCourse } = require('../controllers/gradesController');
const { authenticateToken } = require('../middlewares/authToken');

router.post(
    '/upload',
    // upload.single('file'),
    uploadInitialGrades
);

router.get('/student/:studentId', authenticateToken, getStudentGradedCourses);
router.get('/student/:studentId/course/:courseId', authenticateToken, getStudentGradeForCourse);

module.exports = router;
