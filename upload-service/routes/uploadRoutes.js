const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { uploadInitialGrades, uploadFinalGrades } = require('../controllers/uploadController');
const { authenticateToken } = require('../middlewares/authToken');

router.post('/initial', authenticateToken, upload.single('file'), uploadInitialGrades);
router.post('/final', authenticateToken, upload.single('file'), uploadFinalGrades);

module.exports = router;

