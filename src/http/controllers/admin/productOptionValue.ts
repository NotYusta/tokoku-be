// src/controllers/admin/productOptionValue.ts
import type { Request, Response } from "express";

import adminProductOptionValueService from "../../../services/admin/productOptionValue.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

const AdminProductOptionValueController = {
  // GET /admin/product-option-values/:id
  getValue: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminProductOptionValueService.getById(id);
      },
      { parseUnhandled: true }
    ),

  // GET /admin/product-option-values
  getAllValues: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1) throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1) throw new ValidationError(["Invalid page size number"]);

        return await adminProductOptionValueService.getAll({ page, pageSize });
      },
      { parseUnhandled: true }
    ),

  // POST /admin/product-option-values
  createValue: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { optionId, name, value, price } = req.body;

        if (!optionId || isNaN(Number(optionId)))
          throw new ValidationError(["optionId is required and must be a number"]);
        if (!name) throw new ValidationError(["name is required"]);
        if (!value) throw new ValidationError(["value is required"]); // added
        if (price !== undefined && isNaN(Number(price)))
          throw new ValidationError(["price must be a number"]);

        return await adminProductOptionValueService.create({
          optionId: Number(optionId),
          name,
          value, // added
          price: price !== undefined ? Number(price) : undefined,
        });
      },
      { parseUnhandled: true }
    ),

  // PUT /admin/product-option-values/:id
  updateValue: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { name, value, price } = req.body;
        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (value !== undefined) updateData.value = value; // added
        if (price !== undefined) {
          if (isNaN(Number(price))) throw new ValidationError(["price must be a number"]);
          updateData.price = Number(price);
        }

        return await adminProductOptionValueService.update(id, updateData);
      },
      { parseUnhandled: true }
    ),

  // DELETE /admin/product-option-values/:id
  deleteValue: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminProductOptionValueService.delete(id);
      },
      { parseUnhandled: true }
    ),
};

export default AdminProductOptionValueController;
