// src/controllers/admin/productOption.ts
import type { Request, Response } from "express";
import Joi from "joi";

import adminProductOptionService from "../../../services/admin/productOption.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import handle from "../../../utils/handler.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
  search: Joi.string().optional().allow(""),
});

const createOptionSchema = Joi.object({
  productId: Joi.number().required(),
  name: Joi.string().required(),
  type: Joi.string().valid("multiple", "dropdown", "text").optional(),
  label: Joi.string().allow(null, "").optional(),
});

const updateOptionSchema = Joi.object({
  name: Joi.string().optional(),
  type: Joi.string().valid("multiple", "dropdown", "text").optional(),
  label: Joi.string().allow(null, "").optional(),
});

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
      { parseUnhandled: true },
    ),

  // GET /admin/product-options
  getAllOptions: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = paginationSchema.validate(req.query);
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        return await adminProductOptionService.getAll({
          page: value.page,
          pageSize: value.page_size,
          search: value.search,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/product-options
  createOption: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = createOptionSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        return await adminProductOptionService.create({
          productId: Number(value.productId),
          name: value.name,
          type: value.type ?? undefined,
          label: value.label ?? null,
        });
      },
      { parseUnhandled: true },
    ),

  // PUT /admin/product-options/:id
  updateOption: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { error, value } = updateOptionSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        const updateData: any = {};
        if (value.name !== undefined) updateData.name = value.name;
        if (value.type !== undefined) updateData.type = value.type;
        if (value.label !== undefined) updateData.label = value.label;

        return await adminProductOptionService.update(id, updateData);
      },
      { parseUnhandled: true },
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
      { parseUnhandled: true },
    ),
};

export default AdminProductOptionController;
