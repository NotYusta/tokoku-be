// src/config/config.ts
import type { IConfig } from "./00_types/configs/config.js";

import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config(); // load .env first

const config: IConfig = loadConfig();

function loadConfig(): IConfig {
  try {
    const production = process.env.NODE_ENV === "production";
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const port = Number(process.env.APP_PORT) || 3000;
    const bind = process.env.APP_BIND || "0.0.0.0";

    const jwtSecret = process.env.JWT_SECRET;
    const encryptionKey = process.env.ENCRYPTION_KEY;

    if (!jwtSecret || !encryptionKey) {
      throw new Error("JWT_SECRET or ENCRYPTION_KEY not defined in .env");
    }

    // ===== Database =====
    const dbName = process.env.DB_NAME;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbPort = Number(process.env.DB_PORT) || 3306;

    if (!dbName || !dbUser || !dbPassword || !dbHost) {
      throw new Error("Database configuration incomplete in .env");
    }

    // ===== Payment Gateway =====
    const xenditApiKey = process.env.XENDIT_API_KEY || "";
    const xenditWebhookToken = process.env.XENDIT_WEBHOOK_TOKEN || "";

    // ===== Notifications =====
    const discordWebhookUrls = process.env.DISCORD_WEBHOOK_URLS
      ? process.env.DISCORD_WEBHOOK_URLS.split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];

    const customUrls = process.env.CUSTOM_WEBHOOK_URLS
      ? process.env.CUSTOM_WEBHOOK_URLS.split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];
const allowOrigins = process.env.APP_ALLOW_ORIGINS
  ? process.env.APP_ALLOW_ORIGINS.split(",").map(u => u.trim()).filter(Boolean)
  : [];

    return {
      production,

      app: {
        allowOrigins,
        url: appUrl,
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

      paymentGateway: {
        xendit: {
          apiKey: xenditApiKey,
          webhookToken: xenditWebhookToken,
        },
      },

      notifications: {
        webhooks: {
          custom: customUrls,
          discord: discordWebhookUrls,
        },
      },
    };
  } catch (err) {
    // PANIC (Go-style)
    logger.fatal({ err }, "Failed to load configuration, exiting");
    process.exit(1);
  }
}

export default config;
