// src/queues/jobRegistry.ts

import type { Job } from "../00_types/jobs.js";
import SendWebhookJob from "../jobs/SendWebhook.js";


const jobRegistry = new Map<string, Job>();

export function initRegistry() {
  const jobList = [SendWebhookJob];
  for (const x of jobList) {
    jobRegistry.set(x.type, x);
  }
}
export function getJob(type: string) {
  return jobRegistry.get(type);
}
