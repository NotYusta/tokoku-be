// src/controllers/admin/productImage.ts
import type { Request, Response } from "express";
import multer from "multer";
import adminProductImageService from "../../../services/admin/productImage.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

const upload = multer({ storage: multer.memoryStorage() });

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
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.page_size) || 20;
      return await adminProductImageService.getAll({ page, pageSize });
    }, { parseUnhandled: true }),

  // POST /admin/product-images
  createImage: [
    upload.single("file"),
    (req: Request, res: Response) =>
      handle(res, async () => {
        const { productId, altText, isPrimary } = req.body;

        // Manual Validation & Casting
        if (!productId) throw new ValidationError(["productId is required"]);
        if (!req.file) throw new ValidationError(["file is required"]);

        return await adminProductImageService.create({
          productId: Number(productId), // Manual cast to Number
          file: req.file,
          altText: altText || null,
          // Manual boolean check for strings "true"/"false"
          isPrimary: isPrimary === "true" || isPrimary === true, 
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

        const { altText, isPrimary } = req.body;
        const updateData: any = {};

        if (req.file) updateData.file = req.file;
        if (altText !== undefined) updateData.altText = altText;
        if (isPrimary !== undefined) {
          updateData.isPrimary = isPrimary === "true" || isPrimary === true;
        }

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