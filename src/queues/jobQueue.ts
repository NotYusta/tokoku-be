import PQueue from "p-queue";
import { initRegistry } from "./jobRegistry.js";
import logger from "../logger.js";
import JobQueueModel from "../models/job.js";
import { processJob } from "./jobProcessor.js";
import { Op } from "sequelize";

export const jobQueue = new PQueue({ concurrency: 3 });

/**
 * Load all pending jobs on server start
 */
export async function initQueues() {
  logger.info("Initializing job queues...");

  initRegistry();

  // Only select the fields we actually use: id, status, runAt
  const pendingJobs = await JobQueueModel.findAll({
    attributes: ["id", "status", "runAt"], // <-- only select used fields
    where: {
      status: "pending",
      runAt: { [Op.lte]: new Date() },
    },
  });

  logger.info({ count: pendingJobs.length }, "Pending jobs found");

  for (const job of pendingJobs) {
    jobQueue.add(() => processJob(job.id));
  }
}
