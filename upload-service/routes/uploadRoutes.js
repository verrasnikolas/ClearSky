const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { confirmCourse, uploadInitialGrades, uploadFinalGrades } = require('../controllers/uploadController');

router.post('/preview', upload.single('file'), confirmCourse);
router.post('/initial', upload.single('file'), uploadInitialGrades);
router.post('/final', upload.single('file'), uploadFinalGrades);

module.exports = router;

