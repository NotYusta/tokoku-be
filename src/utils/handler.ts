import type { Response } from "express";
import {
  mapErrorToResponse,
  type ErrorHandlerOptions,
} from "./errorHandler.js";

export interface HandlerOptions extends ErrorHandlerOptions {
  status?: 200 | 201 | 204;
}

export default async function handle<T>(
  res: Response,
  fn: () => Promise<T> | T,
  opts?: HandlerOptions,
): Promise<void> {
  try {
    const data = await fn();
    const status = opts?.status ?? 200;

    const isEmpty =
      data === null ||
      data === undefined ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "object" &&
        !Array.isArray(data) &&
        Object.keys(data).length === 0);

    if (status === 204 || isEmpty) {
      res.status(204).send();
      return;
    }

    res.status(status).json({ data });
  } catch (err) {
    const { statusCode, body } = mapErrorToResponse(err, opts);
    res.status(statusCode).json(body);
  }
}
