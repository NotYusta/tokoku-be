// utils/discordWebhook.ts
import type { SendWebhookPayload } from "../jobs/SendWebhook.js";

interface DiscordWebhookOptions {
  url: string;
  content: string;
  username?: string;
  avatarUrl?: string;
  extraFields?: Record<string, any>;
}

/**
 * Build a Discord webhook payload using an options object
 */
export function buildDiscordWebhook({
  url,
  content,
  username,
  avatarUrl,
  extraFields,
}: DiscordWebhookOptions): SendWebhookPayload {
  return {
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      content,
      ...(username ? { username } : {}),
      ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
      ...extraFields,
    },
  };
}
