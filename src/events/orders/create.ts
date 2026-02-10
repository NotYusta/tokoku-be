// src/events/order/OrderCompletedEvent.ts
import type { EventEmitter, EventEmitHandler } from "../../00_types/events.js";
import logger from "../../logger.js";
import type OrderModel from "../../models/order.js";

class OrderCreatedEvent implements EventEmitter<OrderModel> {
  private handlers: EventEmitHandler<OrderModel>[] = [];

  public register(handler: EventEmitHandler<OrderModel>) {
    this.handlers.push(handler);
  }

  public async emit(order: OrderModel) {
    logger.debug(
      {
        orderId: order.id,
        userId: order.userId,
        status: order.status,
        transactionId: order.transactionId,
        handlers: this.handlers.length,
      },
      "OrderCreatedEvent.emit triggered",
    );

    for (const handler of this.handlers) {
      try {
        await handler(order);
      } catch (err) {
        logger.error(
          { err, orderId: order.id },
          "OrderCreatedEvent handler failed",
        );
      }
    }
  }
}

const orderCreatedEvent = new OrderCreatedEvent();
export default orderCreatedEvent;
