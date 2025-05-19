const express = require('express');
const router = express.Router();
const controller = require('../controllers/ReviewController');
const validate = require('../middlewares/ValidateReviewRequest');

router.post('/', validate, controller.submitReviewRequest);
router.get('/', controller.getAllReviews);
router.patch('/status', validate.validateReply, controller.replyToReviewRequest);

router.get('/status', controller.getReviewStatus); // ← add this

module.exports = router;
