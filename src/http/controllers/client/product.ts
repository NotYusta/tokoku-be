// src/controllers/client/product.ts
import type { Request, Response } from "express";
import Joi from "joi";

import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import clientProductService from "../../../services/client/product.js";
import { ExtractAuth } from "../../../utils/http.js";
import createOrderProductService from "../../../services/orders/createOrderProduct.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
  only_in_stock: Joi.boolean().optional(),
});

const createOrderSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  selectedOptions: Joi.array()
    .items(
      Joi.object({
        optionId: Joi.number().required(),
        valueIds: Joi.array().items(Joi.number()), // optional for dropdown/multiple
        customValue: Joi.string().trim(), // optional for text/dropdown
      })
        .or("valueIds", "customValue") // at least one required
        .unknown(false), // forbid other keys like 'value'
    )
    .optional(),
});

const ProductController = {
  // GET /products/:id
  getProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await clientProductService.getById(id);
      },
      { parseUnhandled: true },
    ),

  // GET /products
  getAllProducts: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = paginationSchema.validate(req.query);
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        return await clientProductService.getAll({
          page: value.page,
          pageSize: value.page_size,
          onlyInStock: value.only_in_stock ?? false,
        });
      },
      { parseUnhandled: true },
    ),

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

        const { uid } = ExtractAuth(req);
        return await createOrderProductService.handle({
          userId: uid,
          productId,
          quantity: value.quantity,
          selectedOptions: value.selectedOptions,
        });
      },
      { parseUnhandled: true },
    ),
};

export default ProductController;
