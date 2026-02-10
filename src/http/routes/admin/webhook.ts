import { Router } from "express";
import AdminWebhookController from "../../controllers/admin/webhook.js";

const adminWebhookRoutes = (adminGroup: Router) => {
  // ===== User management routes =====
  const adminWebhookGroup = Router();
  adminGroup.use("/webhooks", adminWebhookGroup);

  adminWebhookGroup.get("/", AdminWebhookController.getAllWebhooks); // GET all users
  adminWebhookGroup.get("/:id", AdminWebhookController.getWebhook); // GET single user
  adminWebhookGroup.post("/", AdminWebhookController.createWebhook); // CREATE new user
  adminWebhookGroup.put("/:id", AdminWebhookController.updateWebhook); // UPDATE user
  adminWebhookGroup.delete("/:id", AdminWebhookController.deleteWebhook); // DELETE user
};

export default adminWebhookRoutes;