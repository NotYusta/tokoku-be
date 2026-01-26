// src/controllers/admin/productOption.ts
import type { Request, Response } from "express";

import adminProductOptionService from "../../../services/admin/productOption.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import handle from "../../../utils/handler.js";


const AdminProductOptionController = {
  // GET /admin/product-options/:id
  getOption: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminProductOptionService.getById(id);
      },
      { parseUnhandled: true }
    ),

  // GET /admin/product-options
  getAllOptions: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1) throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1) throw new ValidationError(["Invalid page size number"]);

        return await adminProductOptionService.getAll({ page, pageSize });
      },
      { parseUnhandled: true }
    ),

  // POST /admin/product-options
  createOption: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { productId, name, type, label } = req.body;

        if (!productId || isNaN(Number(productId)))
          throw new ValidationError(["productId is required and must be a number"]);
        if (!name) throw new ValidationError(["name is required"]);
        if (type && !["single", "multiple", "dropdown", "text"].includes(type))
          throw new ValidationError(["type must be one of single, multiple, dropdown, text"]);

        return await adminProductOptionService.create({
          productId: Number(productId),
          name,
          type: type as any,
          label: label ?? null,
        });
      },
      { parseUnhandled: true }
    ),

  // PUT /admin/product-options/:id
  updateOption: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { name, type, label } = req.body;
        const updateData: any = {};

        if (name !== undefined) updateData.name = name;
        if (type !== undefined) {
          if (!["single", "multiple", "dropdown", "text"].includes(type))
            throw new ValidationError(["type must be one of single, multiple, dropdown, text"]);
          updateData.type = type;
        }
        if (label !== undefined) updateData.label = label;

        return await adminProductOptionService.update(id, updateData);
      },
      { parseUnhandled: true }
    ),

  // DELETE /admin/product-options/:id
  deleteOption: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminProductOptionService.delete(id);
      },
      { parseUnhandled: true }
    ),
};

export default AdminProductOptionController;
