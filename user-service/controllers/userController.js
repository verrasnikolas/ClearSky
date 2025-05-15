const User = require('../models/users.js');

exports.addUser = async (req, res) => {
    try {
        const { email, name, academicId, password, role } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, name, academicId, role, password: hashedPassword });
        return res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUserByAcademicId = async (req, res) => {
    try {
        const user = await User.findOne({ where: { academicId: req.params.academicId } });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { email, name, academicId } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        user.email = email ?? user.email;
        user.name = name ?? user.name;
        user.academicId = academicId ?? user.academicId;
        await user.save();
        return res.json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const bcrypt = require('bcrypt');

exports.changePassword = async (req, res) => {
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

exports.loginUser = async (req, res) => {
    const { role, email, academicId, password } = req.body;

    if (!role || !password) {
        return res.status(400).json({ error: 'Role and password are required' });
    }

    let user;

    try {
        if (role === 'student') {
            if (!academicId) return res.status(400).json({ error: 'Academic ID is required for students' });
            user = await User.findOne({ where: { academicId, role } });
        } else if (role === 'instructor' || role === 'institution_representative') {
            if (!email) return res.status(400).json({ error: 'Email is required for instructors and institution representatives' });
            user = await User.findOne({ where: { email, role } });
        } else {
            return res.status(400).json({ error: 'Invalid role' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Success login response (no token creation here)
        return res.json({
            id: user.id,
            name: user.name,
            role: user.role,
            message: 'Login successful'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


