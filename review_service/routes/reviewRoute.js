const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/ReviewController');
const validate = require('../middlewares/ValidateReviewRequest');
const { authenticateToken } = require('../middlewares/authToken');

// Store uploaded files in /uploads and preserve original names
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


router.post('/', authenticateToken, validate, controller.submitReviewRequest);
router.get('/', authenticateToken, controller.getAllReviews);
router.patch('/status', authenticateToken, upload.single('attachment'), controller.replyToReviewRequest);


router.get('/status', authenticateToken, controller.getReviewStatus); // ← add this

module.exports = router;
