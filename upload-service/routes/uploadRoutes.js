const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadInitialGrades } = require('../controllers/uploadController');

router.post('/initial', upload.single('file'), uploadInitialGrades);

module.exports = router;

