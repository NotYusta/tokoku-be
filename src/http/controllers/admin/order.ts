// src/controllers/admin/order.ts
import type { Request, Response } from "express";

import adminOrderService from "../../../services/admin/order.js";
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from "../../../utils/customErrors.js";
import handle from "../../../utils/handler.js";
import Joi from "joi";
import { ExtractAuth } from "../../../utils/http.js";
import createOrderProductService from "../../../services/orders/createOrderProduct.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
});

const createOrderSchema = Joi.object({
  userId: Joi.number().required(),
  quantity: Joi.number().integer().min(1).required(),
  selectedOptions: Joi.array()
    .items(
      Joi.object({
        optionId: Joi.number().required(),
        valueIds: Joi.array().items(Joi.number()),   // optional for dropdown/multiple
        customValue: Joi.string().trim(),           // optional for text/dropdown
      })
        .or("valueIds", "customValue")               // at least one required
        .unknown(false),                             // forbid other keys like 'value'
    )
    .optional(),
  payerEmail: Joi.string().email().optional(),
});

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
      { parseUnhandled: true },
    ),

  // GET /admin/orders
  getAllOrders: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = paginationSchema.validate(req.query);
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));
        return await adminOrderService.getAll({
          page: value.page,
          pageSize: value.page_size,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/orders
  // POST /products/:id/order
  createOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const productId = Number(req.params.id);
        if (isNaN(productId)) throw new ValidationError(["Invalid product id"]);

        const { error, value } = createOrderSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        // Call CreateOrderProductService
        const result = await createOrderProductService.handle({
          userId: value.userId,
          productId,
          quantity: value.quantity,
          selectedOptions: value.selectedOptions ?? [],
          payerEmail: value.payerEmail,
        });

        return result; // returns { order, url }
      },
      { parseUnhandled: true },
    ),

  // PUT /admin/orders/:id
  updateOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const {
          name,
          description,
          unitPrice,
          quantity,
          currency,
          payload,
          paymentMethod,
          paymentRef,
        } = req.body;

        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (unitPrice !== undefined) {
          if (isNaN(Number(unitPrice)))
            throw new ValidationError(["unitPrice must be a number"]);
          updateData.unitPrice = Number(unitPrice);
        }
        if (quantity !== undefined) {
          if (isNaN(Number(quantity)))
            throw new ValidationError(["quantity must be a number"]);
          updateData.quantity = Number(quantity);
        }
        if (currency !== undefined) updateData.currency = currency;
        if (payload !== undefined) updateData.payload = payload;
        if (paymentMethod !== undefined)
          updateData.paymentMethod = paymentMethod;
        if (paymentRef !== undefined) updateData.paymentRef = paymentRef;

        return await adminOrderService.update(id, updateData);
      },
      { parseUnhandled: true },
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

        const validStatuses = [
          "pending",
          "processing",
          "completed",
          "cancelled",
        ];
        if (!validStatuses.includes(status)) {
          throw new BadRequestError("Invalid status");
        }

        return await adminOrderService.updateStatus(id, status);
      },
      { parseUnhandled: true },
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
      { parseUnhandled: true },
    ),
};

export default AdminOrderController;
