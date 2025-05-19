const ReviewRequest = require('../models/ReviewRequest');

exports.submitReviewRequest = async (req, res) => {
    const { student_id, course_id, reason } = req.body;

    if (!student_id || !course_id || !reason) {
        return res.status(400).json({ error: 'student_id, course_id, and reason are required.' });
    }

    try {
        const review = await ReviewRequest.create({ student_id, course_id, reason });
        res.status(201).json(review);
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({ error: 'Failed to submit review request.' });
    }
};


exports.replyToReviewRequest = async (req, res) => {
    const { student_id, course_id, status, response } = req.body;

    if (!student_id || !course_id || !status || !response) {
        return res.status(400).json({ error: 'Missing required fields: student_id, course_id, status, response.' });
    }

    try {
        const review = await ReviewRequest.findOne({
            where: {
                student_id,
                course_id
            }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found for the specified student and course.' });
        }

        review.status = status;
        review.response = response;
        await review.save();

        res.json(review);
    } catch (err) {
        console.error('Error replying to review:', err);
        res.status(500).json({ error: 'Failed to update review.' });
    }
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

exports.getReviewStatus = async (req, res) => {
    const { student_id, course_id } = req.query;

    // Validate required query params
    if (!student_id || !course_id) {
        return res.status(400).json({ error: 'student_id and course_id are required.' });
    }

    try {
        const review = await ReviewRequest.findOne({
            where: {
                student_id,
                course_id
            }
        });

        if (!review) {
            return res.status(404).json({ message: 'No review found for this student and course.' });
        }

        res.json(review);
    } catch (err) {
        console.error('Error fetching review status:', err);
        res.status(500).json({ error: 'Server error' });
    }
};