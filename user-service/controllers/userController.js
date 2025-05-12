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

exports.registerInstitution = async (req, res) => {
    try {
        const { userId, institutionName } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.role !== 'institution_representative') {
            return res.status(403).json({ error: 'Permission denied. Only institution representatives can register institutions.' });
        }

        // Dummy Logic (θα γίνει σε άλλο microservice later)
        console.log(`Institution "${institutionName}" registered by ${user.name} (id: ${user.id})`);

        return res.status(201).json({ message: `Institution "${institutionName}" registered successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
