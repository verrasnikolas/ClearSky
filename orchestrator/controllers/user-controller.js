// controllers/user-controller.js
const userService = require('../services/user-service');

const createUser = async (req, res, next) => {
    try {
        // Temporary - until microservice is ready
        res.status(201).json({ message: 'User creation requested', data: req.body });
        //const newUser = await userService.createUser(req.body);
        //res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        // Προσωρινή απάντηση
        res.json({ message: `User requested with ID: ${req.params.id}` });
        //const user = await userService.getUser(req.params.id);
        //res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = { createUser, getUser };