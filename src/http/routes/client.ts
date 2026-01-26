import { Router, type Express } from "express";
import authMiddleware from "../middlewares/auth.js";
import ClientAccountController from "../controllers/client/account.js";
import ClientOrderController from "../controllers/client/order.js";
import corsMiddleware from "../middlewares/cors.js";

const clientRoutes = (app: Express) => {
  const clientGroup = Router();
  app.use("/api/client", clientGroup);

  clientGroup.use(corsMiddleware)
  // All client routes require authentication
  clientGroup.use(authMiddleware);

  // ===== Account =====
  clientGroup.get("/account", ClientAccountController.getAccount);



  // ===== Orders =====
  clientGroup.get("/orders", ClientOrderController.getOrders);
  clientGroup.get("/orders/:id", ClientOrderController.getOrder);
};

export default clientRoutes;
