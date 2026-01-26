// src/00_types/jobs.ts

import type { JobQueueModel } from "../models/job.ts";

export interface Job<T = any> {
  readonly type: string; // unique type for the job
  readonly retries: number; // number of retry attempts allowed
  readonly delay: number; // optional delay between retries in ms
  handle(payload: T): Promise<void>; // function to execute the job
  enqueue(payload: T, runAt?: Date): Promise<JobQueueModel>;
}
