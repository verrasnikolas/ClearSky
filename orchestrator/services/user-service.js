// services/user-service.js
// connecting orchestrator with microservice user
const axios = require('axios'); // js library for HTTP requests

const createUser = async (userData) => {
    try {
        console.log('Calling user microservice to create user:', userData);
        // Προσωρινή λογική (μέχρι να φτιαχτεί το microservice)
        return { message: 'User created in microservice', data: userData };
        //const response = await axios.post('http://user-service/users', userData);
        //return response.data;
    } catch (error) {
        throw error;
    }
};

const getUser = async (userId) => {
    try {
        console.log('Calling user microservice to get user with ID:', userId);
        // Προσωρινή λογική
        return { message: `User found in microservice with ID: ${userId}` };
        //const response = await axios.get(`http://user-service/users/${userId}`);
        //return response.data;
    } catch (error) {
        throw error;
    }
};

module.exports = { createUser, getUser };