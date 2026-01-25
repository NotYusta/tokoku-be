import express from "express";
import logger from "./logger.js";
import config from "./config.js";
import { registerRoutes } from "./http/routes/index.js";

async function start() {
  logger.info(config.app.port, "Starting application");
  const app = express();

  registerRoutes(app);
}

start();
