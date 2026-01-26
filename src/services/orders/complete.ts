// src/services/orders/OrderPaymentService.ts
import orderCompletedEvent from "../../events/orders/complete.js";
import logger from "../../logger.js";
import OrderModel from "../../models/order.js";
import TransactionModel from "../../models/transaction.js";
import ProductModel from "../../models/product.js";
import { sequelize } from "../../database.js";

class OrderPaymentCompleteService {
  public async handle(transaction: TransactionModel) {
    logger.debug(
      { transactionId: transaction.id },
      "OrderPaymentService.handle called",
    );

    const orders = await OrderModel.findAll({
      where: { transactionId: String(transaction.id) },
    });

    if (!orders.length) {
      logger.debug(
        { transactionId: transaction.id },
        "No orders linked to transaction",
      );
      return;
    }

    await sequelize.transaction(async (t) => {
      // 1. Update orders status
      await OrderModel.update(
        { status: "completed" },
        { where: { transactionId: String(transaction.id) }, transaction: t },
      );

      // 2. Update product stocks
      for (const order of orders) {
        // Parse payload safely
        // Ensure payload is typed as an array of objects with productId
        const payload = JSON.parse(order.payload);
        const productId = payload.length > 0 ? payload[0].productId : undefined;
        const quantity = order.quantity;
        if (!productId) {
          throw new Error(
            `Product ID missing in order payload for order ${order.id}`,
          );
        }

        const product = await ProductModel.findByPk(productId, {
          transaction: t,
        });
        if (!product) {
          throw new Error(`Product not found for order ${order.id}`);
        }

        if (product.stock < quantity) {
          throw new Error(`Insufficient stock for product ${product.id}`);
        }

        await product.update(
          { stock: product.stock - quantity },
          { transaction: t },
        );
      }

      // 3. Emit order completed events
      for (const order of orders) {
        await orderCompletedEvent.emit(order);
      }
    });

    logger.info(
      {
        transactionId: transaction.id,
        orderIds: orders.map((o) => o.id),
      },
      "Orders marked as completed and product stocks updated",
    );
  }
}

const orderPaymentCompleteService = new OrderPaymentCompleteService();
export default orderPaymentCompleteService;
