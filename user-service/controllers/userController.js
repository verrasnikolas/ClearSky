const User = require('../models/users.js');
const bcrypt = require('bcrypt');

const addUser = async (req, res) => {
    try {
        const {email, username, name, academicId, password, role} = req.body;
        // Derive username for students (already validated in middlewares)
        const resolvedUsername = role === 'student' ? email.split('@')[0] : username;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({email, username: resolvedUsername, name, academicId, role, password: hashedPassword});
        return res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'Internal server error'});
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserByAcademicId = async (req, res) => {
    try {
        const user = await User.findOne({ where: { academicId: req.params.academicId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, username } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (name) user.name = name;

        if (user.role !== 'student') {
            if (email) user.email = email;
            if (username) user.username = username;
        }

        await user.save();

        return res.json({
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role,
            academicId: user.academicId,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ error: 'New password is required' });
        }
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        return res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.params.email } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addUser,
    getUserById,
    getUserByAcademicId,
    updateUser,
    changePassword,
    getUserByEmail
};