require('dotenv').config(); // Load .env file for local development

module.exports = {
  development: {
    username: process.env.DB_USER_DEV || 'your_dev_username',
    password: process.env.DB_PASSWORD_DEV || 'your_dev_password',
    database: process.env.DB_NAME_DEV || 'your_dev_database',
    host: process.env.DB_HOST_DEV || 'localhost',
    port: process.env.DB_PORT_DEV || 5432,
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USER, // Rely on environment variable
    password: process.env.DB_PASSWORD, // Rely on environment variable
    database: process.env.DB_NAME, // Rely on environment variable
    host: process.env.DB_HOST, // Rely on environment variable
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
    // You can add production-specific options here later (e.g., SSL)
  }
};