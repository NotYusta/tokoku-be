import type { Request, Response, NextFunction } from "express";
import logger from "../../logger.js";
import {
  ValidationError,
  AuthError,
  NotFoundError,
  ForbiddenError,
} from "../../utils/handler.js";

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
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
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    responseBody = { error: "forbidden" };
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    responseBody = { error: err.message };
  } else {
    // Log the error with Pino
    logger.error({ err, url: req.url, method: req.method }, "Unhandled error");
  }

  // Respond to client
  res.status(statusCode).json(responseBody);
}
