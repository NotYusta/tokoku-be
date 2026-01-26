// src/services/admin/order.ts
import logger from "../../logger.js";
import OrderModel from "../../models/order.js";
import TransactionModel from "../../models/transaction.js";

import { BadRequestError, NotFoundError } from "../../utils/customErrors.js";

class AdminOrderService {
  // ===== READ =====
  public async getById(id: number) {
    const order = await OrderModel.findByPk(id);
    if (!order) throw new NotFoundError();
    return order;
  }

  // ===== READ ALL =====
  public async getAll({
    page = 1,
    pageSize = 20,
  }: { page?: number; pageSize?: number } = {}) {
    const offset = (page - 1) * pageSize;

    const { rows, count } = await OrderModel.findAndCountAll({
      limit: pageSize,
      offset,
      order: [["id", "ASC"]],
    });

    return {
      orders: rows,
      pagination: {
        total: count,
        page,
        pageSize,
        pages: Math.ceil(count / pageSize),
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
    currency?: string;
    payload?: any;
    gateway: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
  }) {
    if (data.quantity <= 0)
      throw new BadRequestError("quantity must be greater than 0");
    if (data.unitPrice <= 0)
      throw new BadRequestError("unitPrice must be greater than 0");

    const totalPrice = Number(data.unitPrice) * data.quantity;
    const currency = data.currency ?? "IDR";

    // 1️⃣ Create transaction (invoice)
    const transaction = await TransactionModel.create({
      userId: data.userId,
      description: data.description ?? data.name,
      amount: totalPrice,
      currency,
      gateway: data.gateway,
      status: "pending",
    });

    // 2️⃣ Create order linked to transaction
    const order = await OrderModel.create({
      userId: data.userId,
      name: data.name,
      description: data.description ?? null,
      unitPrice: data.unitPrice,
      quantity: data.quantity,
      totalPrice,
      currency,
      status: "pending",
      transactionId: String(transaction.id),
      payload: data.payload ?? null,
    });

    logger.debug(
      { orderId: order.id, transactionId: transaction.id },
      "Order + transaction created",
    );

    return { order, transaction };
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
      status: "pending" | "processing" | "completed" | "cancelled";
    }>,
  ) {
    const order = await OrderModel.findByPk(id);
    if (!order) throw new NotFoundError();

    const updateData: any = { ...data };

    // recompute totalPrice if needed
    if (data.unitPrice !== undefined || data.quantity !== undefined) {
      const unitPrice = data.unitPrice ?? order.unitPrice;
      const quantity = data.quantity ?? order.quantity;

      if (unitPrice <= 0 || quantity <= 0)
        throw new BadRequestError("invalid price or quantity");

      updateData.totalPrice = Number(unitPrice) * quantity;
    }

    await order.update(updateData);
    return order;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    const order = await OrderModel.findByPk(id);
    if (!order) throw new NotFoundError();

    await order.destroy();
    return { success: true };
  }

  // ===== UPDATE STATUS =====
  public async updateStatus(
    id: number,
    status: "pending" | "processing" | "completed" | "cancelled",
  ) {
    const order = await OrderModel.findByPk(id);
    if (!order) throw new NotFoundError();

    await order.update({ status });
    return order;
  }
}

export default new AdminOrderService();
