import config from "../config.js";
import notifierHub from "./hub.js";
import CustomWebhookNotifier from "./webhook/custom.js";
import DiscordWebhookNotifier from "./webhook/discord.js";

export async function registerNotifications() {
  /**
   * Transaction paid notifications
   */
  if (config.notifications.webhooks.discord.length > 0) {
    for (const v of config.notifications.webhooks.discord) {
      notifierHub.register(new DiscordWebhookNotifier(v));
    }
  }

  if (config.notifications.webhooks.custom.length > 0) {
    for (const v of config.notifications.webhooks.custom) {
      notifierHub.register(new CustomWebhookNotifier(v));
    }
  }
}
