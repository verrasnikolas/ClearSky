const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadInitialGrades, uploadFinalGrades } = require('../controllers/uploadController');

router.post('/initial', upload.single('file'), uploadInitialGrades);
router.post('/final', upload.single('file'), uploadFinalGrades);

module.exports = router;

