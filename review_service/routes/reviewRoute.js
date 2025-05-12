const express = require('express');
const router = express.Router();
const controller = require('../controllers/ReviewController');
const validate = require('../middlewares/ValidateReviewRequest');

router.post('/', validate, controller.submitReviewRequest);
router.get('/', controller.getAllReviews);
router.patch('/:id', validate.validateReply, controller.replyToReviewRequest);

module.exports = router;
