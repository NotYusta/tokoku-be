// src/services/admin/adminProductOptionValueService.ts
import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import ProductOptionValueModel from "../../models/productOptionValue.js";
import { NotFoundError } from "../../utils/customErrors.js";


class AdminProductOptionValueService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminProductOptionValueService.getById called");

    const value = await ProductOptionValueModel.findByPk(id);
    if (!value) {
      logger.debug({ id }, "ProductOptionValue not found in getById");
      throw new NotFoundError();
    }

    logger.debug({ id, name: value.name }, "ProductOptionValue found in getById");
    return value;
  }

  public async getAll({
    page = 1,
    pageSize = 20,
  }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug({ page, pageSize, offset }, "AdminProductOptionValueService.getAll called");

    const { rows: values, count: total } = await ProductOptionValueModel.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["id", "ASC"]],
    });

    logger.debug(
      { page, pageSize, returned: values.length, total },
      "AdminProductOptionValueService.getAll completed"
    );

    return {
      values,
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
    optionId: number;
    name: string;
    price?: number;
  }) {
    logger.debug({ name: data.name }, "AdminProductOptionValueService.create called");

    const value = await ProductOptionValueModel.create({
      optionId: data.optionId,
      name: data.name,
      price: data.price ?? 0,
    });

    logger.debug({ id: value.id }, "AdminProductOptionValueService.create completed");
    return value;
  }

  // ===== UPDATE =====
  public async update(
    id: number,
    data: Partial<{
      name: string;
      price: number;
    }>
  ) {
    logger.debug({ id, data }, "AdminProductOptionValueService.update called");

    const value = await ProductOptionValueModel.findByPk(id);
    if (!value) {
      logger.debug({ id }, "ProductOptionValue not found in update");
      throw new NotFoundError();
    }

    await value.update(data);

    logger.debug({ id }, "AdminProductOptionValueService.update completed");
    return value;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminProductOptionValueService.delete called");

    const value = await ProductOptionValueModel.findByPk(id);
    if (!value) {
      logger.debug({ id }, "ProductOptionValue not found in delete");
      throw new NotFoundError();
    }

    await value.destroy();
    logger.debug({ id }, "AdminProductOptionValueService.delete completed");

    return { success: true };
  }
}

const adminProductOptionValueService = new AdminProductOptionValueService();
export default adminProductOptionValueService;
