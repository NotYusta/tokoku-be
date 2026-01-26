// src/controllers/admin/product.ts
import type { Request, Response } from "express";
import Joi from "joi";

import adminProductService from "../../../services/admin/product.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

// ===== Joi Schemas =====
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, ""),
  price: Joi.number().required(),
  stock: Joi.number().optional(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().allow(null, "").optional(),
  price: Joi.number().optional(),
  stock: Joi.number().optional(),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
});

const AdminProductController = {
  // GET /admin/products/:id
  getProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminProductService.getById(id);
      },
      { parseUnhandled: true },
    ),

  // GET /admin/products
  getAllProducts: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = paginationSchema.validate(req.query);
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminProductService.getAll({
          page: value.page,
          pageSize: value.page_size,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/products
  createProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = createProductSchema.validate(req.body);
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminProductService.create(value);
      },
      { parseUnhandled: true },
    ),

  // PUT /admin/products/:id
  updateProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { error, value } = updateProductSchema.validate(req.body);
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminProductService.update(id, value);
      },
      { parseUnhandled: true },
    ),

  // DELETE /admin/products/:id
  deleteProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminProductService.delete(id);
      },
      { parseUnhandled: true },
    ),
};

export default AdminProductController;
