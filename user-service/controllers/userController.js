const User = require('../models/users.js');

exports.addUser = async (req, res) => {
    try {
        const { email, name, academicId } = req.body;
        const newUser = await User.create({ email, name, academicId });
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