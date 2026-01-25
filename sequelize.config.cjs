// sequelize.config.cjs
require("dotenv").config();

const defaultConfig = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
};

module.exports = {
  development: defaultConfig,
  production: defaultConfig,
  // Default environment for sequelize-cli
  // If NODE_ENV is not set, sequelize-cli will pick production
  _default: "production",
};
