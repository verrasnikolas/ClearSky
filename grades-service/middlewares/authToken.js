const jwt = require('jsonwebtoken');
const { isTokenRevoked } = require('../utils/blacklist.js');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    if (isTokenRevoked(token)) {
        return res.status(401).json({ error: 'Token has been revoked' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // { userId, role, ... }
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };