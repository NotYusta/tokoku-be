// src/jobs/sendWebhookJob.ts

import type { Job } from "../00_types/jobs.js";
import logger from "../logger.js";
import { enqueueJob } from "../queues/jobProcessor.js";

export type SendWebhookPayload = {
  url: string;
  method?: "POST" | "GET" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
};

const SendWebhookJob: Job<SendWebhookPayload> = {
  type: "send_webhook",
  retries: 3,
  delay: 0,
  async handle(payload) {
    try {
      logger.info({ payload }, "Sending webhook...");

      const response = await fetch(payload.url, {
        method: payload.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...(payload.headers || {}),
        },
        body: payload.body ? JSON.stringify(payload.body) : undefined,
      });

      const text = await response.text();
      if (!response.ok) {
        logger.error(
          { status: response.status, response: text },
          "Webhook failed",
        );
        throw new Error(`Webhook failed with status ${response.status}`);
      }

      logger.info(
        { status: response.status, response: text },
        "Webhook sent successfully",
      );
    } catch (err) {
      logger.error({ err, payload }, "Error sending webhook");
      throw err; // Let the queue handle retries
    }
  },
  enqueue: async function (payload: SendWebhookPayload, runAt?: Date) {
    return await enqueueJob(this, payload, runAt);
  },
};

export default SendWebhookJob;
