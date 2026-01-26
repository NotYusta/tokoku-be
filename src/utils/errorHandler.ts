import logger from "../logger.js";
import { ValidationError as SequelizeValidationError } from "sequelize";
import {
  ValidationError,
  AuthError,
  NotFoundError,
  ForbiddenError,
  UnprocessableError,
} from "./customErrors.js";

export interface ErrorHandlerOptions {
  message?: string;
  parseUnhandled?: boolean;
}

export function mapErrorToResponse(
  err: unknown,
  opts?: ErrorHandlerOptions,
): { statusCode: number; body: Record<string, any> } {
  let statusCode = 500;
  let responseBody: Record<string, any> = { error: "internal_server_error" };

  if (err instanceof ValidationError) {
    statusCode = 400;
    responseBody = { error: err.fields.join("\n") };
  } else if (err instanceof AuthError) {
    statusCode = 401;
    responseBody = { error: "unauthorized" };
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    responseBody = { error: "not_found" };
  } else if (err instanceof UnprocessableError) {
    statusCode = 422;
    responseBody = { error: opts?.message ?? err.message };
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    responseBody = { error: opts?.message ?? "forbidden" };
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    responseBody = { error: err.message };
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
      logger.error({ err }, opts?.message ?? "Unhandled error");
    }
  }

  return { statusCode, body: responseBody };
}
