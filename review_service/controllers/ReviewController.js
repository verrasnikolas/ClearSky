const ReviewRequest = require('../models/ReviewRequest');

exports.submitReviewRequest = async (req, res) => {
    const { gradeEntryId, reason } = req.body;
    const review = await ReviewRequest.create({ gradeEntryId, reason });
    res.status(201).json(review);
};

exports.replyToReviewRequest = async (req, res) => {
    const { id } = req.params;
    const { status, response } = req.body;
    const review = await ReviewRequest.findByPk(id);

    if (!review) return res.status(404).json({ error: 'Not found' });

    review.status = status;
    review.response = response;
    await review.save();

    res.json(review);
};

exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await ReviewRequest.findAll();
        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};