import { Router, type Express } from "express";
import ProductController from "../controllers/product/product.js";
import authMiddleware from "../middlewares/auth.js";
import corsMiddleware from "../middlewares/cors.js";
const productRoutes = (app: Express) => {
  const productGroup = Router();

  app.use("/api/products", productGroup);

  // ===== Products =====
  productGroup.use(corsMiddleware)
  productGroup.get("/", ProductController.getAllProducts);
  productGroup.get("/:id", ProductController.getProduct);
  productGroup.post("/:id/order", authMiddleware, ProductController.createOrder); // <--- new
};

export default productRoutes;
