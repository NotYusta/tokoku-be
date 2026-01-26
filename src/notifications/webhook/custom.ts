// src/notifications/webhook/CustomWebhookNotifier.ts
import logger from "../../logger.js";
import type { Notifier } from "../../00_types/notifications.js";

/**
 * Sends notifications to a custom webhook URL.
 * Can transform the input payload before sending.
 */
class CustomWebhookNotifier<T = any> implements Notifier<T> {
  constructor(private readonly url: string, private readonly transformer?: (input: T) => any) {}

  /**
   * Transform the payload before sending.
   * If a transformer function is provided, use it.
   * Otherwise, return the payload as-is.
   */
  public transform(input: T): any {
    if (this.transformer) {
      try {
        return this.transformer(input);
      } catch (err) {
        logger.error({ err, url: this.url }, "Payload transformation failed");
        return input; // fallback to original
      }
    }
    return input;
  }

  /**
   * Notify the webhook with the given payload
   * @param payload Transformed payload
   */
  public async notify(payload: any) {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      logger.debug({ url: this.url, payload }, "Custom webhook notified");
    } catch (err) {
      logger.error({ err, url: this.url, payload }, "Custom webhook failed");
    }
  }
}

export default CustomWebhookNotifier;
