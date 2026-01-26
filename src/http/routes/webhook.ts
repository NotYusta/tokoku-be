import { Router, type Express } from "express";
import { WebhookController } from "../controllers/webhook/webhook.js";
const webhookRoutes = (app: Express) => {
  const webhookGroup = Router();

  app.use("/api/webhook", webhookGroup);
  webhookGroup.post("/xendit", WebhookController.xendit);
};

export default webhookRoutes;
