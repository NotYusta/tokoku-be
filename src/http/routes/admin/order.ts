import { Router } from "express";
import AdminOrderController from "../../controllers/admin/order.js";

const adminOrderRoutes = (adminGroup: Router) => {
  // ===== Order management routes =====
  const adminOrderGroup = Router();
  adminGroup.use("/orders", adminOrderGroup);

  adminOrderGroup.get("/", AdminOrderController.getAllOrders); // GET all orders
  adminOrderGroup.get("/:id", AdminOrderController.getOrder); // GET single order
  adminOrderGroup.post("/", AdminOrderController.createOrder); // CREATE new order
  adminOrderGroup.put("/:id", AdminOrderController.updateOrder); // UPDATE order details (including payload)
  adminOrderGroup.put("/:id/status", AdminOrderController.updateOrderStatus); // UPDATE order status
  adminOrderGroup.delete("/:id", AdminOrderController.deleteOrder); // DELETE order
};

export default adminOrderRoutes;
