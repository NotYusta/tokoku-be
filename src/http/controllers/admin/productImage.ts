// src/controllers/admin/productImage.ts
import type { Request, Response } from "express";
import multer from "multer";

import adminProductImageService from "../../../services/admin/productImage.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

// Configure Multer (memory storage so we can access file.buffer directly)
const upload = multer({ storage: multer.memoryStorage() });

const AdminProductImageController = {
  // GET /admin/product-images/:id
  getImage: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();
        return await adminProductImageService.getById(id);
      },
      { parseUnhandled: true }
    ),

  // GET /admin/product-images
  getAllImages: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page size number"]);

        return await adminProductImageService.getAll({ page, pageSize });
      },
      { parseUnhandled: true }
    ),

  // POST /admin/product-images
  createImage: [
    upload.single("file"), // Multer middleware, expects field name "file"
    (req: Request, res: Response) =>
      handle(
        res,
        async () => {
          const { productId, altText, isPrimary } = req.body;

          if (!productId || isNaN(Number(productId)))
            throw new ValidationError([
              "productId is required and must be a number",
            ]);

          if (!req.file) throw new ValidationError(["file is required"]);

          return await adminProductImageService.create({
            productId: Number(productId),
            file: req.file, // Multer file object
            altText: altText ?? null,
            isPrimary: isPrimary === "true" || isPrimary === true,
          });
        },
        { parseUnhandled: true }
      ),
  ],

  // PUT /admin/product-images/:id
  updateImage: [
    upload.single("file"), // Multer middleware, optional file
    (req: Request, res: Response) =>
      handle(
        res,
        async () => {
          const id = Number(req.params.id);
          if (isNaN(id)) throw new NotFoundError();

          const { altText, isPrimary } = req.body;
          const updateData: any = {};

          if (req.file) updateData.file = req.file; // new file
          if (altText !== undefined) updateData.altText = altText;
          if (isPrimary !== undefined) {
            if (typeof isPrimary === "string")
              updateData.isPrimary = isPrimary === "true";
            else updateData.isPrimary = Boolean(isPrimary);
          }

          return await adminProductImageService.update(id, updateData);
        },
        { parseUnhandled: true }
      ),
  ],

  // DELETE /admin/product-images/:id
  deleteImage: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();
        return await adminProductImageService.delete(id);
      },
      { parseUnhandled: true }
    ),
};

export default AdminProductImageController;
