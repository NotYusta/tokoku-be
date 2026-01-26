import { Router, type Express } from "express";
import authMiddleware from "../middlewares/auth.js";
import ClientAccountController from "../controllers/client/account.js";
import ProductController from "../controllers/client/product.js";
import ClientOrderController from "../controllers/client/order.js";

const clientRoutes = (app: Express) => {
  const clientGroup = Router();
  app.use("/api/client", clientGroup);
  clientGroup.use(authMiddleware);

  // Account
  clientGroup.get("/account", ClientAccountController.getAccount);

  // Products
  clientGroup.get("/products", ProductController.getAllProducts);
  clientGroup.get("/products/:id", ProductController.getProduct);

  // Orders
  clientGroup.get("/orders", ClientOrderController.getOrders);
  clientGroup.get("/orders/:id", ClientOrderController.getOrder);
};

export default clientRoutes;
