import type { Express } from "express";
import express from "express";
import config from "../../config.js";
import logger from "../../logger.js";

import clientRoutes from "./client.js";
import adminRoutes from "./admin.js";
import healthRoutes from "./health.js";
import authRoutes from "./auth.js";
import errorMiddleware from "../middlewares/error.js";
import logMiddleware from "../middlewares/log.js";

export const registerRoutes = (app: Express) => {
  registerMiddlewares(app);

  authRoutes(app);
  clientRoutes(app);
  adminRoutes(app);
  healthRoutes(app);

  app.use(errorMiddleware);
  app.listen(config.app.port, config.app.bind, () => {
    logger.info(
      `Server is running on http://${config.app.bind}:${config.app.port}`,
    );
  });
};

const registerMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logMiddleware);
};
