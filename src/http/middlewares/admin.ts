// src/auth/middleware.ts
import type { Request, Response, NextFunction } from "express";
import { ExtractAuth, ExtractClient } from "../../utils/http.js";
import { ForbiddenError } from "../../utils/handler.js";

export default function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = ExtractAuth(req);
  if ( !authHeader.uadmin) {
    throw new ForbiddenError();
  }

  next();
}
