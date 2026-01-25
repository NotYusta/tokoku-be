import { Router, type Express } from "express";
import authMiddleware from "../middlewares/auth.js";
import adminMiddleware from "../middlewares/admin.js";
import AdminUserController from "../controllers/admin/user.js";
import AdminProductController from "../controllers/admin/product.js";
import AdminOrderController from "../controllers/admin/order.js";
import AdminTransactionController from "../controllers/admin/transaction.js";

const adminRoutes = (app: Express) => {
  const adminGroup = Router();
  app.use("/api/admin", adminGroup);

  // Apply auth and admin middlewares to all admin routes
  adminGroup.use(authMiddleware);
  adminGroup.use(adminMiddleware);

  // ===== User management routes =====
  const adminUserGroup = Router();
  adminGroup.use("/users", adminUserGroup);

  adminUserGroup.get("/", AdminUserController.getAllUsers); // GET all users
  adminUserGroup.get("/:id", AdminUserController.getUser); // GET single user
  adminUserGroup.post("/", AdminUserController.createUser); // CREATE new user
  adminUserGroup.put("/:id", AdminUserController.updateUser); // UPDATE user
  adminUserGroup.delete("/:id", AdminUserController.deleteUser); // DELETE user

  // ===== Product management routes =====
  const adminProductGroup = Router();
  adminGroup.use("/products", adminProductGroup);

  adminProductGroup.get("/", AdminProductController.getAllProducts); // GET all products
  adminProductGroup.get("/:id", AdminProductController.getProduct); // GET single product
  adminProductGroup.post("/", AdminProductController.createProduct); // CREATE new product
  adminProductGroup.put("/:id", AdminProductController.updateProduct); // UPDATE product
  adminProductGroup.delete("/:id", AdminProductController.deleteProduct); // DELETE product

  // ===== Order management routes =====
  const adminOrderGroup = Router();
  adminGroup.use("/orders", adminOrderGroup);

  adminOrderGroup.get("/", AdminOrderController.getAllOrders); // GET all orders
  adminOrderGroup.get("/:id", AdminOrderController.getOrder); // GET single order
  adminOrderGroup.post("/", AdminOrderController.createOrder); // CREATE new order
  adminOrderGroup.put("/:id/status", AdminOrderController.updateOrderStatus); // UPDATE order status
  adminOrderGroup.delete("/:id", AdminOrderController.deleteOrder); // DELETE order

  const adminTransactionGroup = Router();
  adminGroup.use("/transactions", adminTransactionGroup);

  adminTransactionGroup.get("/", AdminTransactionController.getAllTransactions);
  adminTransactionGroup.get("/:id", AdminTransactionController.getTransaction);
  adminTransactionGroup.post("/", AdminTransactionController.createTransaction);
  adminTransactionGroup.put(
    "/:id/status",
    AdminTransactionController.updateTransactionStatus,
  );
  adminTransactionGroup.delete(
    "/:id",
    AdminTransactionController.deleteTransaction,
  );
};

export default adminRoutes;
