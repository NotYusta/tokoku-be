import type { Express } from "express";
import express from "express";
import config from "../../config.js";
import logger from "../../logger.js";
import { registerClientRoutes } from "./client.js";
import { registerAdminRoutes } from "./admin.js";
import { registerHealthRoutes } from "./health.js";

export const registerRoutes = (app: Express) => {
  registerMiddlewares(app);

  registerClientRoutes(app);
  registerAdminRoutes(app);
  registerHealthRoutes(app);
  app.listen(config.app.port, config.app.bind, () => {
    logger.info(`Server is running on http://${config.app.bind}:${config.app.port}`);
  });
};


const registerMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
