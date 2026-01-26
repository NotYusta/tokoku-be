// src/controllers/admin/productImage.ts
import type { Request, Response } from "express";
import multer from "multer";
import Joi from "joi";

import adminProductImageService from "../../../services/admin/productImage.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

// Configure Multer (memory storage so we can access file.buffer directly)
const upload = multer({ storage: multer.memoryStorage() });

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
});

const createImageSchema = Joi.object({
  productId: Joi.number().integer().required(),
  altText: Joi.string().allow(null, "").optional(),
  isPrimary: Joi.boolean().optional(),
});

const updateImageSchema = Joi.object({
  altText: Joi.string().allow(null, "").optional(),
  isPrimary: Joi.boolean().optional(),
});

const AdminProductImageController = {
  // GET /admin/product-images/:id
  getImage: (req: Request, res: Response) =>
    handle(res, async () => {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new NotFoundError();
      return await adminProductImageService.getById(id);
    }, { parseUnhandled: true }),

  // GET /admin/product-images
  getAllImages: (req: Request, res: Response) =>
    handle(res, async () => {
      const { error, value } = paginationSchema.validate(req.query);
      if (error) throw new ValidationError(error.details.map(d => d.message));

      return await adminProductImageService.getAll({
        page: value.page,
        pageSize: value.page_size,
      });
    }, { parseUnhandled: true }),

  // POST /admin/product-images
  createImage: [
    upload.single("file"),
    (req: Request, res: Response) =>
      handle(res, async () => {
        const { error, value } = createImageSchema.validate(req.body, { abortEarly: false });
        if (error) throw new ValidationError(error.details.map(d => d.message));

        if (!req.file) throw new ValidationError(["file is required"]);

        return await adminProductImageService.create({
          productId: value.productId,
          file: req.file,
          altText: value.altText ?? null,
          isPrimary: value.isPrimary ?? false,
        });
      }, { parseUnhandled: true }),
  ],

  // PUT /admin/product-images/:id
  updateImage: [
    upload.single("file"),
    (req: Request, res: Response) =>
      handle(res, async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { error, value } = updateImageSchema.validate(req.body, { abortEarly: false });
        if (error) throw new ValidationError(error.details.map(d => d.message));

        const updateData: any = {};
        if (req.file) updateData.file = req.file;
        if (value.altText !== undefined) updateData.altText = value.altText;
        if (value.isPrimary !== undefined) updateData.isPrimary = value.isPrimary;

        return await adminProductImageService.update(id, updateData);
      }, { parseUnhandled: true }),
  ],

  // DELETE /admin/product-images/:id
  deleteImage: (req: Request, res: Response) =>
    handle(res, async () => {
      const id = Number(req.params.id);
      if (isNaN(id)) throw new NotFoundError();
      return await adminProductImageService.delete(id);
    }, { parseUnhandled: true }),
};

export default AdminProductImageController;
