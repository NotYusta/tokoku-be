import type { Request } from "express";

import type { ClientContext } from "../00_types/contexts/client.js";
import logger from "../logger.js";
import type { AuthPayload } from "../00_types/contexts/auth.js";
import { AuthError } from "./customErrors.js";


/**
 * Extract authenticated user payload from request context
 */
export function ExtractAuth(req: Request): AuthPayload {
  if (!req.auth) {
    logger.error("[ExtractAuth] Auth payload missing on request");
    throw new AuthError("missing auth payload");
  }

  logger.debug({ auth: req.auth }, "[ExtractAuth] Auth payload extracted");
  return req.auth as AuthPayload;
}

export function ExtractClient(req: Request): ClientContext {
  return {
    userAgent: req.headers["user-agent"] ?? "unknown",
    ip: req.ip || req.connection.remoteAddress || "unknown",
    origin: req.headers.origin,
  };
}
