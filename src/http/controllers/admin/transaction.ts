// src/controllers/admin/transaction.ts
import type { Request, Response } from "express";

import adminTransactionService from "../../../services/admin/transaction.js";
import { BadRequestError, NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import handle from "../../../utils/handler.js";

const AdminTransactionController = {
  // GET /admin/transactions/:id
  getTransaction: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminTransactionService.getById(id);
      },
      { parseUnhandled: true },
    ),

  // GET /admin/transactions
  getAllTransactions: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page size number"]);

        return await adminTransactionService.getAll({ page, pageSize });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/transactions
  createTransaction: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { userId, description, amount, currency, gateway, gatewayRef } =
          req.body;

        const errors: string[] = [];
        if (!userId) errors.push("userId is required");
        if (!description) errors.push("description is required");
        if (!amount || isNaN(Number(amount)))
          errors.push("amount is required and must be a number");
        if (!currency) errors.push("currency is required");
        if (!gateway) errors.push("gateway is required");

        if (errors.length) throw new ValidationError(errors);

        return await adminTransactionService.create({
          userId: Number(userId),
          description,
          amount: Number(amount),
          currency,
          gateway,
          gatewayRef,
        });
      },
      { parseUnhandled: true },
    ),

  // PUT /admin/transactions/:id/status
  updateTransactionStatus: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { status } = req.body;
        if (!status) throw new ValidationError(["status is required"]);

        const validStatuses = ["pending", "paid", "failed"];
        if (!validStatuses.includes(status))
          throw new BadRequestError("Invalid status");

        return await adminTransactionService.updateStatus(id, status);
      },
      { parseUnhandled: true },
    ),

  // DELETE /admin/transactions/:id
  deleteTransaction: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminTransactionService.delete(id);
      },
      { parseUnhandled: true },
    ),
};

export default AdminTransactionController;
