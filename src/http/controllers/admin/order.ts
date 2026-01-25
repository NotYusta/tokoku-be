// src/controllers/admin/order.ts
import type { Request, Response } from "express";

import {
  handle,
  NotFoundError,
  ValidationError,
  BadRequestError,
} from "../../../utils/handler.js";
import adminOrderService from "../../../services/admin/order.js";

const AdminOrderController = {
  // GET /admin/orders/:id
  getOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminOrderService.getById(id);
      },
      { parseUnhandled: true }
    ),

  // GET /admin/orders
  getAllOrders: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page size number"]);

        return await adminOrderService.getAll({ page, pageSize });
      },
      { parseUnhandled: true }
    ),

  // POST /admin/orders
  createOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const {
          userId,
          name,
          description,
          unitPrice,
          quantity,
          currency,
          paymentMethod,
          paymentRef,
        } = req.body;

        // Basic validation
        const errors: string[] = [];
        if (!userId) errors.push("userId is required");
        if (!name) errors.push("name is required");
        if (unitPrice == null || isNaN(Number(unitPrice)))
          errors.push("unitPrice is required and must be a number");
        if (quantity == null || isNaN(Number(quantity)))
          errors.push("quantity is required and must be a number");
        if (!currency) errors.push("currency is required");
        if (!paymentMethod) errors.push("paymentMethod is required");

        if (errors.length) throw new ValidationError(errors);

        return await adminOrderService.create({
          userId: Number(userId),
          name,
          description,
          unitPrice: Number(unitPrice),
          quantity: Number(quantity),
          currency,
          paymentMethod,
          paymentRef,
        });
      },
      { parseUnhandled: true }
    ),

  // PUT /admin/orders/:id/status
  updateOrderStatus: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { status } = req.body;
        if (!status) throw new ValidationError(["status is required"]);

        const validStatuses = ["pending", "processing", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
          throw new BadRequestError("Invalid status");
        }

        return await adminOrderService.updateStatus(id, status);
      },
      { parseUnhandled: true }
    ),

  // DELETE /admin/orders/:id
  deleteOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminOrderService.delete(id);
      },
      { parseUnhandled: true }
    ),
};

export default AdminOrderController;
