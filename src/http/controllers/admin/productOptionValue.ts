// src/controllers/admin/productOptionValue.ts
import type { Request, Response } from "express";
import Joi from "joi";

import adminProductOptionValueService from "../../../services/admin/productOptionValue.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
});

const createValueSchema = Joi.object({
  optionId: Joi.number().required(),
  name: Joi.string().required(),
  value: Joi.string().required(),
  price: Joi.number().optional(),
});

const updateValueSchema = Joi.object({
  name: Joi.string().optional(),
  value: Joi.string().optional(),
  price: Joi.number().optional(),
});

const AdminProductOptionValueController = {
  // GET /admin/product-option-values/:id
  getValue: (req: Request, res: Response) =>
    handle(res, async () => {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new NotFoundError();

      return await adminProductOptionValueService.getById(id);
    }, { parseUnhandled: true }),

  // GET /admin/product-option-values
  getAllValues: (req: Request, res: Response) =>
    handle(res, async () => {
      const { error, value } = paginationSchema.validate(req.query);
      if (error) throw new ValidationError(error.details.map(d => d.message));

      return await adminProductOptionValueService.getAll({
        page: value.page,
        pageSize: value.page_size,
      });
    }, { parseUnhandled: true }),

  // POST /admin/product-option-values
  createValue: (req: Request, res: Response) =>
    handle(res, async () => {
      const { error, value } = createValueSchema.validate(req.body, { abortEarly: false });
      if (error) throw new ValidationError(error.details.map(d => d.message));

      return await adminProductOptionValueService.create({
        optionId: Number(value.optionId),
        name: value.name,
        value: value.value,
        price: value.price !== undefined ? Number(value.price) : undefined,
      });
    }, { parseUnhandled: true }),

  // PUT /admin/product-option-values/:id
  updateValue: (req: Request, res: Response) =>
    handle(res, async () => {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new NotFoundError();

      const { error, value } = updateValueSchema.validate(req.body, { abortEarly: false });
      if (error) throw new ValidationError(error.details.map(d => d.message));

      const updateData: any = {};
      if (value.name !== undefined) updateData.name = value.name;
      if (value.value !== undefined) updateData.value = value.value;
      if (value.price !== undefined) updateData.price = Number(value.price);

      return await adminProductOptionValueService.update(id, updateData);
    }, { parseUnhandled: true }),

  // DELETE /admin/product-option-values/:id
  deleteValue: (req: Request, res: Response) =>
    handle(res, async () => {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new NotFoundError();

      return await adminProductOptionValueService.delete(id);
    }, { parseUnhandled: true }),
};

export default AdminProductOptionValueController;
