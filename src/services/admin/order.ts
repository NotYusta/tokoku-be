// src/services/admin/order.ts
import logger from "../../logger.js";
import OrderModel from "../../models/order.js";

import { BadRequestError, NotFoundError } from "../../utils/customErrors.js";

class AdminOrderService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminOrderService.getById called");

    const order = await OrderModel.findByPk(id);

    if (!order) {
      logger.debug({ id }, "Order not found in getById");
      throw new NotFoundError();
    }

    logger.debug({ id: order.id }, "Order found in getById");
    return order;
  }

  // ===== READ ALL =====
  public async getAll({
    page = 1,
    pageSize = 20,
  }: { page?: number; pageSize?: number } = {}) {
    const offset = (page - 1) * pageSize;
    logger.debug({ page, pageSize, offset }, "AdminOrderService.getAll called");

    const { rows: orders, count: total } = await OrderModel.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["id", "ASC"]],
    });

    logger.debug(
      { page, pageSize, returned: orders.length, total },
      "AdminOrderService.getAll completed",
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

  // ===== CREATE =====
  public async create(data: {
    userId: number;
    name: string;
    description?: string | null;
    unitPrice: number;
    quantity: number;
    currency: string;
    payload?: any;
    paymentMethod: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
    paymentRef?: string | null;
  }) {
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
  public async update(
    id: number,
    data: Partial<{
      name: string;
      description: string | null;
      unitPrice: number;
      quantity: number;
      currency: string;
      payload: any;
      paymentMethod: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
      paymentRef?: string | null;
      status: "pending" | "processing" | "completed" | "cancelled";
    }>,
  ) {
    logger.debug({ id, data }, "AdminOrderService.update called");

    const order = await OrderModel.findByPk(id);
    if (!order) {
      logger.debug({ id }, "Order not found in update");
      throw new NotFoundError();
    }

    await order.update(data);
    logger.debug({ id }, "AdminOrderService.update completed");

    return order.get({ plain: true });
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

  // ===== UPDATE STATUS =====
  public async updateStatus(
    id: number,
    status: "pending" | "processing" | "completed" | "cancelled",
  ) {
    logger.debug({ id, status }, "AdminOrderService.updateStatus called");

    const order = await OrderModel.findByPk(id);
    if (!order) {
      logger.debug({ id }, "Order not found in updateStatus");
      throw new NotFoundError();
    }

    await order.update({ status });
    logger.debug({ id, status }, "AdminOrderService.updateStatus completed");

    return order;
  }
}

const adminOrderService = new AdminOrderService();
export default adminOrderService;
