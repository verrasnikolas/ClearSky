const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const { addRevokedToken, isTokenRevoked } = require('../utils/blacklist');
const User = require('../models/users');
const { Op } = require('sequelize');

const login = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Username/Email and Password are required' });
    }

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { username: identifier },
                    { email: identifier }
                ]
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials (user not found)' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        console.log('[DEBUG] Plain password input:', password);
        console.log('[DEBUG] Stored hash from DB:', user.password);
        const hashedInput = await bcrypt.hash(password, 10);
        console.log('[DEBUG] Hashed version of input password:', hashedInput);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials (wrong password)' });
        }

        const accessToken = generateAccessToken(user);
        console.log('[DEBUG] Access Token Payload:', jwt.decode(accessToken));

        const refreshToken = generateRefreshToken(user);

        console.log(`[AUTH] ✅ Login success for user ${user.username || user.email}`);

        return res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                name: user.name,
                academicId: user.academicId
            }
        });

    } catch (err) {
        console.error('[AUTH] ❌ Login error:', err.message);
        return res.status(500).json({ error: 'Internal server error during login' });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'No refresh token provided' });
    }

    if (isTokenRevoked(refreshToken)) {
        return res.status(403).json({ error: 'Refresh token has been revoked' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payload = {
            userId: decoded.userId,
            role: decoded.role,
        };
        const newAccessToken = generateAccessToken(payload);

        return res.json({ accessToken: newAccessToken });

    } catch (err) {
        console.error('[AUTH] ❌ Invalid refresh token:', err.message);
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};

const logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.body.refreshToken;

    if (!accessToken && !refreshToken) {
        return res.status(400).json({ error: 'No token provided for logout' });
    }

    if (accessToken) {
        addRevokedToken(accessToken);
        console.log(`[AUTH] ✅ Access token revoked: ${accessToken.substring(0, 10)}...`);
    }

    if (refreshToken) {
        addRevokedToken(refreshToken);
        console.log(`[AUTH] ✅ Refresh token revoked: ${refreshToken.substring(0, 10)}...`);
    }

    return res.json({ message: 'Logged out successfully' });
};

module.exports = {
    login,
    refreshToken,
    logout
};