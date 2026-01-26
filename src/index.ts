import express from "express";
import logger from "./logger.js";
import config from "./config.js";
import { registerRoutes } from "./http/routes/index.js";
import { initQueues } from "./queues/jobQueue.js";
import { testWebhook } from "./test.js";
import {  initDatabase } from "./models/index.js";

async function start() {
  logger.info(config.app.port, "Starting application");
  const app = express();
  await initDatabase();
  await initQueues();
  await testWebhook();
  registerRoutes(app);
}

start();
