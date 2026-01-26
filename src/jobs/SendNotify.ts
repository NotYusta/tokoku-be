// src/jobs/sendNotifyJob.ts
import logger from "../logger.js";
import { enqueueJob } from "../queues/jobProcessor.js";
import notifierHub from "../notifications/hub.js";
import type { Job } from "../00_types/jobs.js";

export type SendNotifyPayload = any; // Generic payload, will be handled by notifierHub

const SendNotifyJob: Job<SendNotifyPayload> = {
  type: "send_notify",
  retries: 3,
  delay: 0,

  async handle(payload) {
    try {
      logger.info({ payload }, "Sending notification via NotifierHub...");
      await notifierHub.notify(payload);
      logger.info("Notification sent via NotifierHub");
    } catch (err) {
      logger.error({ err, payload }, "Error sending notification via NotifierHub");
      throw err; // Let the queue handle retries
    }
  },

  enqueue: async function (payload: SendNotifyPayload, runAt?: Date) {
    return await enqueueJob(this, payload, runAt);
  },
};

export default SendNotifyJob;
