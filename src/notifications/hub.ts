// src/notifications/NotifierHub.ts
import type { Notifier } from "../00_types/notifications.js";
import logger from "../logger.js";

/**
 * Centralized notification hub
 * - Registers multiple notifiers
 * - Automatically transforms payloads via each notifier's `transform` method
 */
class NotifierHub<T = any> {
  private notifiers: Notifier<T>[] = [];

  /**
   * Register a notifier
   * @param notifier Notifier instance
   */
  public register(notifier: Notifier<T>) {
    this.notifiers.push(notifier);

    logger.debug(
      { total: this.notifiers.length },
      "Notifier registered",
    );
  }

  /**
   * Notify all registered notifiers with the given payload
   * Each notifier transforms the payload before sending
   * @param payload Input payload
   */
  public async notify(payload: T) {
    if (!this.notifiers.length) {
      logger.debug("No notifiers registered");
      return;
    }

    logger.debug(
      { handlers: this.notifiers.length },
      "NotifierHub.notify triggered",
    );

    for (const notifier of this.notifiers) {
      try {
        // Transform the payload into the format expected by this notifier
        const transformed = notifier.transform(payload);

        // Send the transformed payload
        await notifier.notify(transformed);
      } catch (err) {
        logger.error({ err }, "Notifier failed");
      }
    }
  }
}

// Singleton instance
const notifierHub = new NotifierHub();
export default notifierHub;
