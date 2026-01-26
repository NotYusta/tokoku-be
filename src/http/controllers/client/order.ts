// src/controllers/client/order.ts
import type { Request, Response } from "express";
import handle from "../../../utils/handler.js";
import { ExtractAuth } from "../../../utils/http.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import clientOrderService from "../../../services/client/order.js";

const ClientOrderController = {
  // GET /client/orders
  getOrders: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { uid } = ExtractAuth(req);

        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page size number"]);

        return await clientOrderService.getAll(uid, { page, pageSize });
      },
      { parseUnhandled: true },
    ),

  // GET /client/orders/:id
  getOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { uid } = ExtractAuth(req);
        const orderId = Number(req.params.id);
        if (isNaN(orderId)) throw new NotFoundError();

        return await clientOrderService.getById(uid, orderId);
      },
      { parseUnhandled: true },
    ),
};

export default ClientOrderController;
