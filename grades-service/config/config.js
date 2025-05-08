require('dotenv').config();

const sharedConfig = {
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  host: process.env.PGHOST,
  port: process.env.PGPORT || 5432,
  dialect: 'postgres'
};

module.exports = {
  development: sharedConfig,
  test: sharedConfig,
  production: sharedConfig
};
