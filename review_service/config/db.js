const { Sequelize } = require('sequelize');

// Load from environment variables (recommended)
const sequelize = new Sequelize(
    process.env.DB_NAME || 'reviewdb',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASS || '1234' +
    '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        port: process.env.DB_PORT || 5432,
        logging: false, // Set to true to see raw SQL queries in console
    }
);

module.exports = sequelize;
