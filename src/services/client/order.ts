// src/services/client/order.ts
import logger from "../../logger.js";
import OrderModel from "../../models/order.js";
import { NotFoundError } from "../../utils/customErrors.js";

interface IPagination {
  page?: number;
  pageSize?: number;
}

class ClientOrderService {
  // ===== READ ALL ORDERS FOR A USER =====
  public async getAll(
    userId: number,
    { page = 1, pageSize = 20 }: IPagination = {},
  ) {
    const offset = (page - 1) * pageSize;
    logger.debug(
      { userId, page, pageSize, offset },
      "ClientOrderService.getAll called",
    );

    const { rows: orders, count: total } = await OrderModel.findAndCountAll({
      where: { userId },
      limit: pageSize,
      offset,
      order: [["id", "ASC"]],
    });

    logger.debug(
      { userId, page, pageSize, returned: orders.length, total },
      "ClientOrderService.getAll completed",
    );

    return {
      orders: orders,
      pagination: {
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  // ===== READ SINGLE ORDER =====
  public async getById(userId: number, orderId: number) {
    logger.debug({ userId, orderId }, "ClientOrderService.getById called");

    const order = await OrderModel.findOne({ where: { id: orderId, userId } });

    if (!order) {
      logger.debug({ userId, orderId }, "Order not found in getById");
      throw new NotFoundError();
    }

    logger.debug({ id: order.id }, "ClientOrderService.getById completed");

    return order;
  }
}

const clientOrderService = new ClientOrderService();
export default clientOrderService;
