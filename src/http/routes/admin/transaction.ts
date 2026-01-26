import { Router } from "express";
import AdminTransactionController from "../../controllers/admin/transaction.js";

const adminTransactionRoutes = (adminGroup: Router) => {
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

export default adminTransactionRoutes;
