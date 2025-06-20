const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../controllers/ReviewController');
const validate = require('../middlewares/ValidateReviewRequest');

// Store uploaded files in /uploads and preserve original names
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


router.post('/', validate, controller.submitReviewRequest);
router.get('/', controller.getAllReviews);
router.patch('/status', upload.single('attachment'), controller.replyToReviewRequest);
router.get('/status', controller.getReviewStatus); // ← add this

module.exports = router;
