import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import { OrderModel, type OrderAttributes } from "../../models/order.js";
import { BadRequestError, NotFoundError } from "../../utils/handler.js";

class AdminOrderService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminOrderService.getById called");

    const order = await OrderModel.findByPk(id);
    if (!order) {
      logger.debug({ id }, "Order not found in getById");
      throw new NotFoundError();
    }

    logger.debug({ id, userId: order.userId }, "Order found in getById");
    return order;
  }

  public async getAll({ page = 1, pageSize = 20 }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug({ page, pageSize, offset }, "AdminOrderService.getAll called");

    const { rows: orders, count: total } = await OrderModel.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["id", "DESC"]],
    });

    logger.debug(
      { page, pageSize, returned: orders.length, total },
      "AdminOrderService.getAll completed",
    );

    return {
      orders,
      pagination: {
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  // ===== CREATE =====
  public async create(
    data: Omit<OrderAttributes, "id" | "status" | "totalPrice"> & {
      quantity: number;
    },
  ) {
    logger.debug({ userId: data.userId }, "AdminOrderService.create called");

    if (data.quantity <= 0)
      throw new BadRequestError("quantity must be greater than 0");
    if (data.unitPrice <= 0)
      throw new BadRequestError("unitPrice must be greater than 0");

    const totalPrice = Number(data.unitPrice) * data.quantity;

    const order = await OrderModel.create({
      ...data,
      totalPrice,
      status: "pending",
    });

    logger.debug({ id: order.id }, "AdminOrderService.create completed");
    return order;
  }

  // ===== UPDATE =====
  public async updateStatus(id: number, status: OrderAttributes["status"]) {
    logger.debug({ id, status }, "AdminOrderService.updateStatus called");

    const order = await OrderModel.findByPk(id);
    if (!order) {
      logger.debug({ id }, "Order not found in updateStatus");
      throw new NotFoundError();
    }

    if (!["pending", "processing", "completed", "cancelled"].includes(status)) {
      throw new BadRequestError("Invalid status");
    }

    await order.update({ status });
    logger.debug({ id, status }, "AdminOrderService.updateStatus completed");

    return order;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminOrderService.delete called");

    const order = await OrderModel.findByPk(id);
    if (!order) {
      logger.debug({ id }, "Order not found in delete");
      throw new NotFoundError();
    }

    await order.destroy();
    logger.debug({ id }, "AdminOrderService.delete completed");

    return { success: true };
  }
}

const adminOrderService = new AdminOrderService();
export default adminOrderService;
