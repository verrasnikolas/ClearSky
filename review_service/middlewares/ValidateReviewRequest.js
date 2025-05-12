module.exports = (req, res, next) => {
    const { gradeEntryId, reason } = req.body;
    if (!gradeEntryId || !reason) {
        return res.status(400).json({ error: 'Missing required fields.' });
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