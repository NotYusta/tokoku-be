// src/services/admin/adminProductImageService.ts
import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import ProductImageModel from "../../models/productImage.js";
import { NotFoundError } from "../../utils/customErrors.js";
import path from "path";
import fs from "fs";
import { UploadConstants } from "../../constants/upload.js";
import config from "../../config.js";

// Ensure upload directory exists
if (!fs.existsSync(UploadConstants.UPLOAD_PRODUCT_DIR)) {
  fs.mkdirSync(UploadConstants.UPLOAD_PRODUCT_DIR, { recursive: true });
}

class AdminProductImageService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminProductImageService.getById called");

    const image = await ProductImageModel.findByPk(id);
    if (!image) throw new NotFoundError();

    return image;
  }

  public async getAll({ page = 1, pageSize = 20 }: IPagination = {}) {
    const offset = (page - 1) * pageSize;
    const { rows: images, count: total } =
      await ProductImageModel.findAndCountAll({
        limit: pageSize,
        offset,
        order: [["id", "ASC"]],
        distinct: true,
      });

    return {
      images,
      pagination: {
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  // ===== CREATE =====
  public async create(data: {
    productId: number;
    file: any;
    altText?: string | null;
    isPrimary?: boolean;
  }) {
    const t = await ProductImageModel.sequelize!.transaction();

    try {
      // If isPrimary is true, unset old primary image for this product
      if (data.isPrimary) {
        await ProductImageModel.update(
          { isPrimary: false },
          {
            where: { productId: data.productId, isPrimary: true },
            transaction: t,
          },
        );
      }

      // Save file
      const filename = `${Date.now()}-${data.file.originalname}`;
      const filePath = path.join(UploadConstants.UPLOAD_PRODUCT_DIR, "/", filename);
      fs.writeFileSync(filePath, data.file.buffer);

      const imgUrl = path.resolve(
        UploadConstants.UPLOAD_PRODUCT_URL_PREFIX,
        filename,
      );

      // Create new image
      const image = await ProductImageModel.create(
        {
          productId: data.productId,
          url: imgUrl,
          altText: data.altText ?? null,
          isPrimary: data.isPrimary ?? false,
        },
        { transaction: t },
      );

      await t.commit();
      return image;
    } catch (err) {
      await t.rollback();
      // Delete file if transaction fails
      const filePath = path.join(
        UploadConstants.UPLOAD_PRODUCT_DIR,
        `${Date.now()}-${data.file.originalname}`,
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      throw err;
    }
  }
  // ===== UPDATE =====
  public async update(
    id: number,
    data: Partial<{
      file: any;
      altText: string | null;
      isPrimary: boolean;
    }>,
  ) {
    const t = await ProductImageModel.sequelize!.transaction();

    try {
      const image = await ProductImageModel.findByPk(id, { transaction: t });
      if (!image) throw new NotFoundError();

      // If new file is uploaded
      if (data.file) {
        const filename = `${Date.now()}-${data.file.originalname}`;
        const filePath = path.join(
          UploadConstants.UPLOAD_PRODUCT_DIR,
          filename,
        );
        fs.writeFileSync(filePath, data.file.buffer);

        // Delete old file
        const oldFilePath = path.join(
          UploadConstants.UPLOAD_PRODUCT_DIR,
          image.url.replace(UploadConstants.UPLOAD_PRODUCT_URL_PREFIX, ""),
        );
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);

        // Update URL
        (data as any).url = path.resolve(
          UploadConstants.UPLOAD_PRODUCT_URL_PREFIX, "/",
          filename,
        );
      }

      // If isPrimary is true, unset other primary images for this product
      if (data.isPrimary) {
        await ProductImageModel.update(
          { isPrimary: false },
          {
            where: { productId: image.productId, isPrimary: true },
            transaction: t,
          },
        );
      }

      // Update the image row
      await image.update(data as any, { transaction: t });

      await t.commit();
      return image;
    } catch (err) {
      await t.rollback();

      // Optional: remove uploaded file if transaction fails
      if (data.file) {
        const failedFilePath = path.join(
          UploadConstants.UPLOAD_PRODUCT_DIR,
          `${Date.now()}-${data.file.originalname}`,
        );
        if (fs.existsSync(failedFilePath)) fs.unlinkSync(failedFilePath);
      }

      throw err;
    }
  }

  // ===== DELETE =====
  public async delete(id: number) {
    const image = await ProductImageModel.findByPk(id);
    if (!image) throw new NotFoundError();

    // Delete file from disk
    const filePath = path.join(
      "uploads",
      image.url.replace(UploadConstants.UPLOAD_PRODUCT_URL_PREFIX, ""),
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await image.destroy();
    return { success: true };
  }
}

const adminProductImageService = new AdminProductImageService();
export default adminProductImageService;
