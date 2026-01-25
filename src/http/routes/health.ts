import { Router, type Express } from "express";
import { HealthController } from "../controllers/health/health.js";
const healthRoutes = (app: Express) => {
  const healthGroup = Router();

  app.use("/api/health", healthGroup);
  healthGroup.get("/", HealthController.getHealth);
};

export default healthRoutes;
