import type { Response } from "express";
import logger from "../logger.js";
import { ValidationError as SequelizeValidationError } from "sequelize";

export interface HandlerOptions {
  status?: 200 | 201 | 204;
  message?: string;
  parseUnhandled?: boolean;
}

// Example custom errors
export class ValidationError extends Error {
  constructor(public readonly fields: string[]) {
    super("Validation failed");
  }
}

export class BadRequestError extends ValidationError {
  constructor(msg: string) {
    super([msg]);
  }
}

export class AuthError extends Error {}
export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}

/**
 * Wrap controller logic with standardized try/catch handling
 * Maps common error types to HTTP status codes
 */
export async function handle<T>(
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
  } catch (err: any) {
    let statusCode = 500;
    let responseBody: Record<string, any> = { error: "internal_server_error" };

    // Map known errors
    if (err instanceof ValidationError) {
      statusCode = 400;
      responseBody = { error: err.fields.join("\n") };
    } else if (err instanceof AuthError) {
      statusCode = 401;
      responseBody = { error: "unauthorized" };
    } else if (err instanceof NotFoundError) {
      statusCode = 404;
      responseBody = { error: "not_found" };
    } else if (err instanceof ForbiddenError) {
      statusCode = 403;
      responseBody = { error: opts?.message ?? "forbidden" };
    } else {
      if (opts?.parseUnhandled) {
        if (err instanceof SequelizeValidationError) {
          statusCode = 422;
          responseBody = { error: err.errors.map((x) => x.message).join("\n") };
        } else if (err instanceof Error) {
          responseBody = { error: err.message };
        }
      }

      if (responseBody.error === "internal_server_error") {
        logger.error({ err }, opts?.message ?? "Unhandled controller error");
      }
    }

    res.status(statusCode).json(responseBody);
  }
}
