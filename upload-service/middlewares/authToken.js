const jwt = require('jsonwebtoken');
const { isTokenRevoked } = require('../utils/blacklist.js');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('[AUTH] raw header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    if (isTokenRevoked(token)) {
        return res.status(401).json({ error: 'Token has been revoked' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('[AUTH] Token error:', err.message);
                return res.sendStatus(403);
            }
            console.log('[AUTH] Token decoded:', user); // You should see role & userId here
            req.user = user;
            next();
        });

    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

module.exports = { authenticateToken };