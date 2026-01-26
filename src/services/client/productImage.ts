import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import ProductModel from "../../models/product.js";
import ProductImageModel from "../../models/productImage.js";
import { NotFoundError } from "../../utils/customErrors.js";

class ClientProductService {
  // ===== READ SINGLE PRODUCT =====
  public async getById(id: number) {
    logger.debug({ id }, "ProductService.getById called");

    const product = await ProductModel.findByPk(id, {
      include: [
        {
          model: ProductImageModel,
          as: "images",
          attributes: ["id", "url", "altText", "isPrimary"],
        },
      ],
    });

    if (!product) {
      logger.debug({ id }, "Product not found in getById");
      throw new NotFoundError();
    }

    logger.debug(
      { id, name: product.name, images: product.images },
      "Product found in getById",
    );
    return product;
  }

  // ===== READ ALL PRODUCTS =====
  public async getAll({
    page = 1,
    pageSize = 20,
    onlyInStock = false,
  }: IPagination & { onlyInStock?: boolean } = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug(
      { page, pageSize, offset, onlyInStock },
      "ProductService.getAll called",
    );

    const where: Record<string, any> = {};
    if (onlyInStock) {
      where.stock = { $gt: 0 }; // only products with stock > 0
    }

    const { rows: products, count: total } = await ProductModel.findAndCountAll(
      {
        where,
        limit: pageSize,
        offset,
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductImageModel,
            as: "images",
            attributes: ["id", "url", "altText", "isPrimary"],
          },
        ],
        distinct: true,
      },
    );

    logger.debug(
      { page, pageSize, returned: products.length, total },
      "ProductService.getAll completed",
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
}

const clientProductService = new ClientProductService();
export default clientProductService;
