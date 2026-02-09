// src/services/admin/adminProductOptionService.ts
import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import ProductOptionModel from "../../models/productOption.js";
import ProductModel from "../../models/product.js";
import { Op } from "sequelize";
import { NotFoundError } from "../../utils/customErrors.js";

class AdminProductOptionService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminProductOptionService.getById called");

    const option = await ProductOptionModel.findByPk(id);
    if (!option) {
      logger.debug({ id }, "ProductOption not found in getById");
      throw new NotFoundError();
    }

    logger.debug({ id, name: option.name }, "ProductOption found in getById");
    return option;
  }

  public async getAll({ page = 1, pageSize = 20, search }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug(
      { page, pageSize, offset, search },
      "AdminProductOptionService.getAll called",
    );

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { label: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: options, count: total } =
      await ProductOptionModel.findAndCountAll({
        where,
        limit: pageSize,
        offset,
        order: [["id", "ASC"]],
        include: [
          {
            model: ProductModel,
            as: "product",
            attributes: ["id", "name"],
          },
        ],
      });

    logger.debug(
      { page, pageSize, returned: options.length, total },
      "AdminProductOptionService.getAll completed",
    );

    return {
      options,
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
    name: string;
    type?: "multiple" | "dropdown" | "text";
    label?: string | null;
  }) {
    logger.debug(
      { name: data.name },
      "AdminProductOptionService.create called",
    );

    const option = await ProductOptionModel.create({
      productId: data.productId,
      name: data.name,
      type: data.type ?? "multiple",
      label: data.label ?? null,
    });

    logger.debug(
      { id: option.id },
      "AdminProductOptionService.create completed",
    );
    return option;
  }

  // ===== UPDATE =====
  public async update(
    id: number,
    data: Partial<{
      name: string;
      type: "multiple" | "dropdown" | "text";
      label: string | null;
    }>,
  ) {
    logger.debug({ id, data }, "AdminProductOptionService.update called");

    const option = await ProductOptionModel.findByPk(id);
    if (!option) {
      logger.debug({ id }, "ProductOption not found in update");
      throw new NotFoundError();
    }

    await option.update(data);

    logger.debug({ id }, "AdminProductOptionService.update completed");
    return option;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminProductOptionService.delete called");

    const option = await ProductOptionModel.findByPk(id);
    if (!option) {
      logger.debug({ id }, "ProductOption not found in delete");
      throw new NotFoundError();
    }

    await option.destroy();
    logger.debug({ id }, "AdminProductOptionService.delete completed");

    return { success: true };
  }
}

const adminProductOptionService = new AdminProductOptionService();
export default adminProductOptionService;
