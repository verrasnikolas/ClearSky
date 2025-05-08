module.exports = (req, res, next) => {
    const { gradeEntryId, reason } = req.body;
    if (!gradeEntryId || !reason) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }
    next();
};

