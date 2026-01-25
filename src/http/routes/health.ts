import { Router, type Express } from "express";
import { HealthController } from "../controllers/health/health.js";
export const registerHealthRoutes = (app: Express) => {
  const healthGroup = Router();

  app.use("/api/health", healthGroup);
  healthGroup.get("/", HealthController.getHealth);
};
