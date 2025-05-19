const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { addRevokedToken, isTokenRevoked } = require('../utils/blacklist');
const User = require('../models/users');

exports.login = async (req, res) => {
    const { email, academicId, password, role } = req.body;

    if (!role || !password) {
        return res.status(400).json({ error: 'Role and password are required' });
    }

    try {
        let user;
        if (role === 'student' && academicId) {
            user = await User.findOne({ where: { academicId } });
        } else if ((role === 'instructor' || role === 'institution_representative') && email) {
            user = await User.findOne({ where: { email } });
        } else {
            return res.status(400).json({ error: 'Invalid credentials (missing academicId or email for the given role)' });
        }

        if (!user || user.role !== role) {
            return res.status(401).json({ error: 'Invalid credentials (user not found or wrong role)' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials (wrong password)' });
        }

        const userPayload = { userId: user.id, role: user.role };
        const accessToken = generateAccessToken(userPayload);
        const refreshToken = generateRefreshToken(userPayload);

        console.log(`[AUTH-SERVICE] ✅ Login success for userId: ${user.id} (${user.role})`);

        return res.json({ accessToken, refreshToken });

    } catch (err) {
        console.error('[AUTH-SERVICE] ❌ Login error:', err.message);
        return res.status(500).json({ error: 'Internal server error during login' });
    }
};

exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'No refresh token provided' });
    }

    if (isTokenRevoked(refreshToken)) {
        return res.status(403).json({ error: 'Refresh token has been revoked' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateAccessToken({ userId: decoded.userId, role: decoded.role });

        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ error: 'Invalid refresh token' });
    }
};

exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.body.refreshToken; // 👈 Προσπαθούμε να λάβουμε το refreshToken από το body

    if (!accessToken && !refreshToken) {
        return res.status(400).json({ error: 'No token provided for logout' });
    }

    if (accessToken) {
        addRevokedToken(accessToken);
        console.log(`[AUTH-SERVICE] ✅ Access token revoked: ${accessToken.substring(0, 10)}...`);
    }

    if (refreshToken) {
        addRevokedToken(refreshToken);
        console.log(`[AUTH-SERVICE] ✅ Refresh token revoked: ${refreshToken.substring(0, 10)}...`);
    }

    return res.json({ message: 'Logged out successfully' });
};
