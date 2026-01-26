import { jobQueue } from "./jobQueue.js";

import logger from "../logger.js";
import JobQueueModel from "../models/job.js";
import type { Job } from "../00_types/jobs.js";
import { getJob } from "./jobRegistry.js";

export async function enqueueJob<T>(jobFunc: Job<T>, payload: T, runAt?: Date) {
  const job = await JobQueueModel.create({
    type: jobFunc.type,
    payload: payload as object,
    status: "pending",
    runAt: runAt || new Date(),
    attempts: 0,
  });

  logger.info({ jobId: job.id, type: jobFunc.type }, "Job enqueued");

  jobQueue.add(() => processJob(job.id));
  return job;
}
export async function processJob(jobId: number) {
  const job = await JobQueueModel.findByPk(jobId);
  if (!job) {
    logger.warn({ jobId }, "Job not found");
    return;
  }

  if (job.status !== "pending") {
    logger.info({ jobId, status: job.status }, "Job skipped (not pending)");
    return;
  }

  const jobImpl = getJob(job.type);
  if (!jobImpl) {
    logger.warn(
      { jobId, type: job.type },
      "No registered handler for this job type",
    );
    job.status = "failed";
    await job.save();
    return;
  }

  job.status = "processing";
  await job.save();
  logger.info({ jobId, type: job.type }, "Job processing started");

  let attempts = job.attempts || 0;
  let delay = Math.max(5, jobImpl.delay);
  while (attempts <= jobImpl.retries) {
    try {
      logger.info(
        { jobId, type: job.type, delay: delay },
        `Waiting before retry #${attempts}`,
      );
      await new Promise((res) => setTimeout(res, delay));

      attempts += 1;
      job.attempts = attempts;
      await job.save();

      // 🔹 Parse payload if it's a string
      const parsedPayload =
        typeof job.payload === "string" ? JSON.parse(job.payload) : job.payload;

      logger.info(
        { jobId, type: job.type, attempt: attempts },
        "Job execution attempt started",
      );
      await jobImpl.handle(parsedPayload);

      job.status = "completed";
      job.finishedAt = new Date();
      await job.save();
      logger.info({ jobId, type: job.type }, "Job completed successfully");
      return;
    } catch (err) {
      logger.error(
        { jobId, type: job.type, attempt: attempts, err },
        "Error executing job",
      );

      if (attempts > jobImpl.retries) {
        job.status = "failed";
        await job.save();
        logger.error(
          { jobId, type: job.type, attempts },
          "Job failed after max retries",
        );
        return;
      } else {
        logger.warn(
          { jobId, type: job.type, attempt: attempts },
          "Retrying job...",
        );
      }
    }
  }
}
