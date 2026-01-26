import express from "express";
import logger from "./logger.js";
import config from "./config.js";
import { registerRoutes } from "./http/routes/00_index.js";
import { initQueues } from "./queues/jobQueue.js";
import { initDatabase } from "./models/index.js";
import { registerEvents } from "./events/events.js";
import { registerNotifications } from "./notifications/index.js";

async function start() {
  logger.info(config.app.port, "Starting application");
  const app = express();
  await registerNotifications();
  await registerEvents();
  await initDatabase();
  await initQueues();

  registerRoutes(app);
}

start();
