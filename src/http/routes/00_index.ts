import type { Express } from "express";
import express from "express";
import config from "../../config.js";
import logger from "../../logger.js";

import clientRoutes from "./client.js";
import adminRoutes from "./admin/admin.js";
import healthRoutes from "./health.js";
import authRoutes from "./auth.js";
import errorMiddleware from "../middlewares/error.js";
import logMiddleware from "../middlewares/log.js";
import uploadRoutes from "./upload.js";
import webhookRoutes from "./webhook.js";
import ratelimitMiddleware from "../middlewares/ratelimiter.js";
import frontendRoutes from "./frontend.js";
import productRoutes from "./product.js";

export const registerRoutes = (app: Express) => {
  app.set("trust proxy", config.app.trustedProxies.includes("*") ? true : config.app.trustedProxies)
  registerMiddlewares(app);

  authRoutes(app);
  clientRoutes(app);
  adminRoutes(app);
  healthRoutes(app);
  uploadRoutes(app);
  webhookRoutes(app);
  productRoutes(app);
  frontendRoutes(app);
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
  app.use(ratelimitMiddleware);
};
