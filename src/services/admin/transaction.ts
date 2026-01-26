import type { IPagination } from "../../00_types/requests/requests.js";
import logger from "../../logger.js";
import TransactionModel from "../../models/transaction.js";
import { BadRequestError, NotFoundError } from "../../utils/customErrors.js";

import { ValidationError } from "../../utils/validation.js";

class AdminTransactionService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminTransactionService.getById called");

    const transaction = await TransactionModel.findByPk(id);
    if (!transaction) {
      logger.debug({ id }, "Transaction not found");
      throw new NotFoundError();
    }

    logger.debug({ id, userId: transaction.userId }, "Transaction found");
    return transaction;
  }

  public async getAll({ page = 1, pageSize = 20 }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug(
      { page, pageSize, offset },
      "AdminTransactionService.getAll called",
    );

    const { rows: transactions, count: total } =
      await TransactionModel.findAndCountAll({
        limit: pageSize,
        offset,
        order: [["id", "DESC"]],
      });

    logger.debug(
      { page, pageSize, returned: transactions.length, total },
      "AdminTransactionService.getAll completed",
    );

    return {
      transactions,
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
    description: string;
    amount: number;
    currency: string;
    gateway: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
    gatewayRef?: string;
  }) {
    logger.debug(
      { userId: data.userId },
      "AdminTransactionService.create called",
    );

    if (!data.description)
      throw new ValidationError(["description is required"]);

    if (!data.amount || isNaN(Number(data.amount)) || data.amount <= 0)
      throw new ValidationError(["amount must be a number greater than 0"]);

    if (!data.currency) throw new ValidationError(["currency is required"]);

    if (!data.gateway) throw new ValidationError(["gateway is required"]);

    const transaction = await TransactionModel.create({
      userId: data.userId,
      description: data.description,
      amount: data.amount,
      currency: data.currency,
      gateway: data.gateway,
      gatewayRef: data.gatewayRef ?? null,
      status: "pending",
    });

    logger.debug(
      { id: transaction.id },
      "AdminTransactionService.create completed",
    );

    return transaction;
  }

  // ===== UPDATE STATUS =====
  public async updateStatus(id: number, status: "pending" | "paid" | "failed") {
    logger.debug({ id, status }, "AdminTransactionService.updateStatus called");

    const transaction = await TransactionModel.findByPk(id);
    if (!transaction) {
      logger.debug({ id }, "Transaction not found");
      throw new NotFoundError();
    }

    await transaction.update({ status });

    logger.debug(
      { id, status },
      "AdminTransactionService.updateStatus completed",
    );

    return transaction;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminTransactionService.delete called");

    const transaction = await TransactionModel.findByPk(id);
    if (!transaction) {
      logger.debug({ id }, "Transaction not found");
      throw new NotFoundError();
    }

    await transaction.destroy();
    logger.debug({ id }, "AdminTransactionService.delete completed");

    return { success: true };
  }
}

const adminTransactionService = new AdminTransactionService();
export default adminTransactionService;
