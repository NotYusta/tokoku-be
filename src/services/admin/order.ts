// src/services/admin/order.ts

import OrderModel from "../../models/order.js";

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
