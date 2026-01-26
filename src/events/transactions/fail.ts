// src/events/transaction/TransactionFailedEvent.ts
import type { EventEmitter, EventEmitHandler } from "../../00_types/events.js";
import logger from "../../logger.js";
import type TransactionModel from "../../models/transaction.js";

class TransactionFailedEvent implements EventEmitter<TransactionModel> {
  private handlers: EventEmitHandler<TransactionModel>[] = [];

  public register(handler: EventEmitHandler<TransactionModel>) {
    this.handlers.push(handler);
  }

  public async emit(transaction: TransactionModel) {
    logger.debug(
      {
        transactionId: transaction.id,
        userId: transaction.userId,
        amount: transaction.amount,
        currency: transaction.currency,
        gateway: transaction.gateway,
        handlers: this.handlers.length,
      },
      "TransactionFailedEvent.emit triggered",
    );

    for (const handler of this.handlers) {
      try {
        await handler(transaction);
      } catch (err) {
        logger.error(
          { err, transactionId: transaction.id },
          "TransactionFailedEvent handler failed",
        );
      }
    }
  }
}

const transactionFailedEvent = new TransactionFailedEvent();
export default transactionFailedEvent;
