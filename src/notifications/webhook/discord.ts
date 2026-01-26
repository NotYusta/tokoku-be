// src/notifications/webhook/discord.ts
import logger from "../../logger.js";
import type { Notifier } from "../../00_types/notifications.js";

export type DiscordPayload = {
  title: string;
  content: string;
};

/**
 * Discord webhook notifier
 * Automatically transforms any payload into a JSON with `title` and `content`
 */
class DiscordNotifier implements Notifier<any> {
  constructor(private readonly webhookUrl: string) {}

  /**
   * Transform any payload into Discord message format
   */
  public transform(payload: any): DiscordPayload {
    const title = payload.title ?? "Notification";
    const content = payload.content ?? JSON.stringify(payload, null, 2);

    return { title, content };
  }

  /**
   * Send the transformed payload to Discord webhook
   */
  public async notify(payload: any) {
    try {
      const res = await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      logger.debug(
        { url: this.webhookUrl, payload: payload },
        "Discord notified",
      );
    } catch (err) {
      logger.error(
        { err, url: this.webhookUrl, payload: payload },
        "Discord notification failed",
      );
    }
  }
}

export default DiscordNotifier;
