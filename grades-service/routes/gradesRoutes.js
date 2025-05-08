const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const parseExcelUpload = require('../middlewares/parseExcelUpload');
const { uploadInitialGrades } = require('../controllers/gradesController');

router.post(
    '/upload',
    upload.single('file'),
    parseExcelUpload,
    uploadInitialGrades
);

module.exports = router;
