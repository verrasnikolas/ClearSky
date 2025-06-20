const jwt = require('jsonwebtoken');
const { isTokenRevoked } = require('../utils/blacklist.js');


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        console.warn('Authorization header missing');
        return res.status(401).json({ error: 'No Authorization header' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        console.warn('Malformed Authorization header:', authHeader);
        return res.status(401).json({ error: 'Malformed Authorization header' });
    }

    const token = parts[1];

    if (isTokenRevoked(token)) {
        return res.status(401).json({ error: 'Token has been revoked' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-role'] = decoded.role;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};



module.exports = { authenticateToken };