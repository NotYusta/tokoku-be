import type { Request, Response, NextFunction } from "express";
import { mapErrorToResponse } from "../../utils/errorHandler.js";

export default function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { statusCode, body } = mapErrorToResponse(err);

  // Respond to client
  res.status(statusCode).json(body);
}
