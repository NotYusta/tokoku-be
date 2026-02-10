import { Router, type Express } from "express";
import authMiddleware from "../../middlewares/auth.js";
import adminMiddleware from "../../middlewares/admin.js";
import adminProductRoutes from "./product.js";
import adminUserRoutes from "./user.js";
import adminOrderRoutes from "./order.js";
import adminTransactionRoutes from "./transaction.js";
import corsMiddleware from "../../middlewares/cors.js";
import adminWebhookRoutes from "./webhook.js";

const adminRoutes = (app: Express) => {
  const adminGroup = Router();
  app.use("/api/admin", adminGroup);

  adminGroup.use(corsMiddleware);

  // Apply auth and admin middlewares to all admin routes
  adminGroup.use(authMiddleware);
  adminGroup.use(adminMiddleware);

  adminUserRoutes(adminGroup);
  adminProductRoutes(adminGroup);
  adminOrderRoutes(adminGroup);
  adminTransactionRoutes(adminGroup);
  adminWebhookRoutes(adminGroup);
};

export default adminRoutes;
