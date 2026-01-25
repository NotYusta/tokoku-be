// src/controllers/admin/product.ts
import type { Request, Response } from "express";

import {
  handle,
  NotFoundError,
  ValidationError,
} from "../../../utils/handler.js";
import adminProductService from "../../../services/admin/product.js";

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
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page size number"]);

        return await adminProductService.getAll({ page, pageSize });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/products
  createProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { name, description, price, stock } = req.body;

        if (!name) throw new ValidationError(["name is required"]);
        if (price == null || isNaN(Number(price)))
          throw new ValidationError(["price is required and must be a number"]);
        if (stock != null && isNaN(Number(stock)))
          throw new ValidationError(["stock must be a number if provided"]);

        return await adminProductService.create({
          name,
          description,
          price: Number(price),
          stock: stock != null ? Number(stock) : undefined,
        });
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

        const { name, description, price, stock } = req.body;
        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price !== undefined) {
          if (isNaN(Number(price)))
            throw new ValidationError(["price must be a number"]);
          updateData.price = Number(price);
        }
        if (stock !== undefined) {
          if (isNaN(Number(stock)))
            throw new ValidationError(["stock must be a number"]);
          updateData.stock = Number(stock);
        }

        return await adminProductService.update(id, updateData);
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
