const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadInitialGrades, getStudentGrades } = require('../controllers/gradesController');

router.post(
    '/upload',
    // upload.single('file'),
    uploadInitialGrades
);

router.get('/student/:studentId', getStudentGrades);

module.exports = router;
