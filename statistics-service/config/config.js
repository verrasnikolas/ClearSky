require('dotenv').config();

module.exports = {
    gradesServiceUrl: process.env.GRADES_SERVICE_URL || 'http://grades-service:3001/api/grades'
};