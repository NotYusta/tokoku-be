// src/controllers/admin/transaction.ts
import type { Request, Response } from "express";
import Joi from "joi";

import adminTransactionService from "../../../services/admin/transaction.js";
import { BadRequestError, NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import handle from "../../../utils/handler.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
});

const createTransactionSchema = Joi.object({
  userId: Joi.number().required(),
  description: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  gateway: Joi.string().required(),
  gatewayRef: Joi.string().optional().allow(null, ""),
});

const updateTransactionStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "paid", "failed").required(),
});

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
        const { error, value } = paginationSchema.validate(req.query);
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminTransactionService.getAll({
          page: value.page,
          pageSize: value.page_size,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/transactions
  createTransaction: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = createTransactionSchema.validate(req.body, { abortEarly: false });
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminTransactionService.create({
          ...value,
          userId: Number(value.userId),
          amount: Number(value.amount),
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

        const { error, value } = updateTransactionStatusSchema.validate(req.body);
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminTransactionService.updateStatus(id, value.status);
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
