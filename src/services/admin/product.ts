import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import ProductModel from "../../models/product.js";
import ProductImageModel from "../../models/productImage.js";
import ProductOptionModel from "../../models/productOption.js";
import ProductOptionValueModel from "../../models/productOptionValue.js";
import { NotFoundError } from "../../utils/customErrors.js";

class AdminProductService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminProductService.getById called");

    const product = await ProductModel.findByPk(id, {
      include: [
        {
          model: ProductImageModel,
          as: "images",
          attributes: [
            "id",
            "url",
            "altText",
            "isPrimary",
            "createdAt",
            "updatedAt",
          ],
        },
        {
          model: ProductOptionModel,
          as: "options",
          attributes: ["id", "name", "type", "label"],
          include: [
            {
              model: ProductOptionValueModel,
              as: "values",
              attributes: [
                "id",
                "name",
                "value",
                "price",
                "createdAt",
                "updatedAt",
              ],
            },
          ],
        },
      ],
    });

    if (!product) {
      logger.debug({ id }, "Product not found in getById");
      throw new NotFoundError();
    }

    logger.debug(
      {
        id,
        name: product.name,
        images: product.images,
        options: product.options,
      },
      "Product found in getById",
    );
    return product;
  }
  
  public async getAll({ page = 1, pageSize = 20 }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug(
      { page, pageSize, offset },
      "AdminProductService.getAll called",
    );

    const { rows: products, count: total } = await ProductModel.findAndCountAll(
      {
        limit: pageSize,
        offset,
        order: [["id", "ASC"]],
        // IMPORTANT: Use distinct to ensure count is accurate with includes
        distinct: true,
        include: [
          {
            model: ProductImageModel,
            as: "images",
            attributes: [
              "id",
              "url",
              "altText",
              "isPrimary",
              "createdAt",
              "updatedAt",
            ],
          },
          {
            model: ProductOptionModel,
            as: "options",
            attributes: ["id", "name", "type", "label"],
            include: [
              {
                model: ProductOptionValueModel,
                as: "values",
                attributes: [
                  "id",
                  "name",
                  "value",
                  "price",
                  "createdAt",
                  "updatedAt",
                ],
              },
            ],
          },
        ],
      },
    );

    logger.debug(
      { page, pageSize, returned: products.length, total },
      "AdminProductService.getAll completed",
    );

    return {
      products,
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
    name: string;
    description?: string | null;
    price: number;
    stock?: number;
  }) {
    logger.debug({ name: data.name }, "AdminProductService.create called");

    const product = await ProductModel.create({
      name: data.name,
      description: data.description ?? null,
      price: data.price,
      stock: data.stock ?? 0,
    });

    logger.debug({ id: product.id }, "AdminProductService.create completed");
    return product;
  }

  // ===== UPDATE =====
  public async update(
    id: number,
    data: Partial<{
      name: string;
      description: string | null;
      price: number;
      stock: number;
    }>,
  ) {
    logger.debug({ id, data }, "AdminProductService.update called");

    const product = await ProductModel.findByPk(id);
    if (!product) {
      logger.debug({ id }, "Product not found in update");
      throw new NotFoundError();
    }

    await product.update(data);

    logger.debug({ id }, "AdminProductService.update completed");
    return product;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminProductService.delete called");

    const product = await ProductModel.findByPk(id);
    if (!product) {
      logger.debug({ id }, "Product not found in delete");
      throw new NotFoundError();
    }

    await product.destroy();
    logger.debug({ id }, "AdminProductService.delete completed");

    return { success: true };
  }
}

const adminProductService = new AdminProductService();
export default adminProductService;
