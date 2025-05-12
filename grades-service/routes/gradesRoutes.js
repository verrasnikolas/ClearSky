const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const parseExcelUpload = require('../middlewares/parseExcelUpload');
const { uploadInitialGrades, getStudentGrades } = require('../controllers/gradesController');

router.post(
    '/upload',
    upload.single('file'),
    parseExcelUpload,
    uploadInitialGrades
);

router.get('/student/:studentId', getStudentGrades);

module.exports = router;
