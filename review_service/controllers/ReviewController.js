const ReviewRequest = require('../models/ReviewRequest');

exports.submitReviewRequest = async (req, res) => {
    const { student_id, course_id, reason } = req.body;

    if (!student_id || !course_id || !reason) {
        return res.status(400).json({ error: 'student_id, course_id, and reason are required.' });
    }

    try {
        // Optional: Pre-check if review already exists
        const existingReview = await ReviewRequest.findOne({
            where: { student_id, course_id }
        });

        if (existingReview) {
            return res.status(409).json({ error: 'A review request already exists for this course.' });
        }

        // Proceed to create new review
        const review = await ReviewRequest.create({ student_id, course_id, reason });
        res.status(201).json(review);
    } catch (err) {
        console.error('Error creating review:', err);

        // Handle uniqueness error in case DB constraint exists
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'A review request already exists for this course.' });
        }

        res.status(500).json({ error: 'Failed to submit review request.' });
    }
};


exports.replyToReviewRequest = async (req, res) => {
    const { student_id, course_id, status, response } = req.body;
    const file = req.file;

    if (!student_id || !course_id || !status || !response) {
        return res.status(400).json({ error: 'Missing required fields: student_id, course_id, status, response.' });
    }

    try {
        const review = await ReviewRequest.findOne({
            where: { student_id, course_id }
        });

        if (!review) {
            return res.status(404).json({ error: 'Review not found for the specified student and course.' });
        }

        review.status = status;
        review.response = response;

        if (file) {
            review.attachment = file.filename; // Save filename to DB
        }

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