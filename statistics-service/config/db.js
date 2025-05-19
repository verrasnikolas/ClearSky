// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Ensure .env variables are loaded

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost', // Use env var, default to localhost
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432 // Also good to use env var for port
});

const CourseStatsModel = require('../models/courseStats')(sequelize, Sequelize);

module.exports = {
    sequelize,
    CourseStats: CourseStatsModel,
};