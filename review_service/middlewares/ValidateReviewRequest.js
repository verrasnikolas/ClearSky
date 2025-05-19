module.exports = (req, res, next) => {
    const { student_id, course_id, reason } = req.body;
    if (!student_id || !course_id || !reason) {
        return res.status(400).json({ error: 'Missing required fields: student_id, course_id, reason.' });
    }
    next();
};



module.exports.validateReply = (req, res, next) => {
    const { status, response } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status) || !response) {
        return res.status(400).json({ error: 'Invalid reply data.' });
    }
    next();
};