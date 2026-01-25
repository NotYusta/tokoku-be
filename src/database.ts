import { Sequelize } from "sequelize";
import config from "./config.js";
import logger from "./logger.js";

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "mysql", // or "postgres"
    logging: config.production
      ? false
      : (msg) => logger.debug(msg), // use Pino instead of console.log
  },
);
