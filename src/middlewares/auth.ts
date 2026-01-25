// src/auth/middleware.ts
import type { Request, Response, NextFunction } from "express";

import logger from "../logger.js";
import { authManager } from "../managers/auth.js";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing_token" });
  }

  const token = header.slice(7);

  try {
    const payload = authManager.authenticate(token);

    // attach to request (Go-style context)
    req.auth = payload;

    return next();
  } catch (err) {
    logger.warn({ err }, "Authentication failed");
    return res.status(403).json({ error: "invalid_token" });
  }
}
