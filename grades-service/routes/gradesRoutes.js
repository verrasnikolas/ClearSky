const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const validateExcelFile = require('../middlewares/validateExcelFile');
const { uploadInitialGrades } = require('../controllers/gradesController');

router.post(
    '/upload',
    upload.single('file'),
    validateExcelFile,
    uploadInitialGrades
);

module.exports = router;
