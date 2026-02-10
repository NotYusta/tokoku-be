// src/notifications/NotifierHub.ts
import type { Notifier } from "../00_types/notifications.js";
import logger from "../logger.js";
import WebhookModel from "../models/webhook.js";
import CustomWebhookNotifier from "./webhook/custom.js";
import DiscordWebhookNotifier from "./webhook/discord.js";

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

    await this.notifyWebhooks(payload);
  }

  private async notifyWebhooks(payload: T) {
    // fetch webhook models by 25 with pagination 
    const webhooksTotal = await WebhookModel.count();
    const webhookPagesTotal = Math.ceil(webhooksTotal / 25);
    for (let i = 0; i < webhookPagesTotal; i++) {
      const webhooks = await WebhookModel.findAll({
        limit: 25,
        offset: i * 25,
      });

      for (const webhook of webhooks) {
        let webhookNotifier: Notifier<T> | undefined = undefined;
        if (webhook.url.includes("discord.com")) {
          webhookNotifier = new DiscordWebhookNotifier(webhook.url);
        } else {
          webhookNotifier = new CustomWebhookNotifier(webhook.url);
        }

        logger.debug({ url: webhook.url, label: webhook.label }, "Calling webhooks from database")
        try {
          const transformed = webhookNotifier.transform(payload);
          await webhookNotifier.notify(transformed);
        } catch (err) {
          logger.error({ err }, "Webhook failed");
        }
      }
    }
  }
}

// Singleton instance
const notifierHub = new NotifierHub();
export default notifierHub;
