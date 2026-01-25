import type { IConfig } from "./00_types/configs/config.js";
import logger from "./logger.js";
import dotenv from "dotenv";
const config: IConfig = loadConfig();

function loadConfig(): IConfig {
  try {
    dotenv.config();
    const port = Number(process.env.APP_PORT) || 1000;
    const bind = process.env.APP_BIND || "0.0.0.0";

    return {
      app: {
        port,
        bind,
        keys: {
          jwtSecret: process.env.APP_JWT_SECRET,
        },
      },
    } as IConfig;
  } catch (err) {
    // PANIC (Go-style)
    logger.fatal({ err }, "Failed to load configuration, exiting");

    process.exit(1);
  }
}

export default config;
