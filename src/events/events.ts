import SendNotifyJob from "../jobs/SendNotify.js";
import logger from "../logger.js";
import orderPaymentCompleteService from "../services/orders/complete.js";
import orderCompletedEvent from "./orders/complete.js";
import orderCreatedEvent from "./orders/create.js";
import transactionFailedEvent from "./transactions/fail.js";
import transactionPaidEvent from "./transactions/paid.js";

export async function registerEvents() {
  logger.info("Registering event handlers...");

  // Centralized notification for all events
  const eventsWithNotifier = [
    orderCompletedEvent,
    orderCreatedEvent,
    transactionPaidEvent,
    transactionFailedEvent,
  ];

  eventsWithNotifier.forEach((event) => {
    event.register(SendNotifyJob.enqueue.bind(SendNotifyJob));
    logger.debug(
      { event: event.constructor.name },
      "SendNotifyJob.enqueue registered for event"
    );
  });

  // Specific side-effect: mark orders as complete on paid transaction
  transactionPaidEvent.register(
    orderPaymentCompleteService.handle.bind(orderPaymentCompleteService)
  );
  logger.debug(
    { event: transactionPaidEvent.constructor.name },
    "OrderPaymentService.complete registered for TransactionPaidEvent"
  );

  logger.info("Event handlers registration completed.");
}
