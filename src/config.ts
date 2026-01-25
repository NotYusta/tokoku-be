// src/config/config.ts
import type { IConfig } from "./00_types/configs/config.js";

import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config(); // load .env first

const config: IConfig = loadConfig();

function loadConfig(): IConfig {
  try {
    const production = process.env.NODE_ENV === "production";

    const port = Number(process.env.APP_PORT) || 3000;
    const bind = process.env.APP_BIND || "0.0.0.0";

    const jwtSecret = process.env.JWT_SECRET;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!jwtSecret || !encryptionKey) {
      throw new Error("JWT_SECRET or ENCRYPTION_KEY not defined in .env");
    }

    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbPort = Number(process.env.DB_PORT) || 3306;

    if (!dbName || !dbUser || !dbPassword || !dbHost) {
      throw new Error("Database configuration incomplete in .env");
    }

    return {
      production,
      app: {
        port,
        bind,
        keys: {
          jwtSecret,
          encryptionKey,
        },
      },
      db: {
        name: dbName,
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
      },
    };
  } catch (err) {
    // PANIC (Go-style)
    logger.fatal({ err }, "Failed to load configuration, exiting");
    process.exit(1);
  }
}

export default config;
