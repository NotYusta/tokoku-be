import type { SendWebhookPayload } from "./jobs/SendWebhook.js";
import SendWebhookJob from "./jobs/SendWebhook.js";
import logger from "./logger.js";
import JobQueueModel from "./models/job.js";

/**
 * Enqueue a test Discord webhook job and check if it exists in DB
 */
export async function testWebhook() {
  const payload: SendWebhookPayload = {
    url: "https://discord.com/api/webhooks/985047581677731870/rFCb7cYxKjIwCrUzhcy3USTZC_lJNEfJzKgO2XTr-oEOiURXa7MOzlz6PPt1sx2uZ1lY",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      username: "TestBot",
      avatar_url: "https://i.imgur.com/AfFp7pu.png",
      content: "Hello from testWebhook! This is a Discord test message.",
    },
  };

  try {
    // Enqueue the job
    const job = await SendWebhookJob.enqueue(payload);

    logger.info({ jobId: job.id }, "Test Discord webhook job enqueued");

    // Check if job exists in DB
    const existingJob = await JobQueueModel.findByPk(job.id);

    if (existingJob) {
      logger.info(
        { jobId: existingJob.id, status: existingJob.status },
        "Job exists in database"
      );
    } else {
      logger.warn({ jobId: job.id }, "Job not found in database after enqueue");
    }
  } catch (err) {
    logger.error({ err }, "Failed to enqueue or check test Discord webhook job");
  }
}
