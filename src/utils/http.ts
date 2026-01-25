import type { Request } from "express";
import { authManager } from "../managers/auth.js";
import type { ClientContext } from "../00_types/contexts/client.js";

export function ExtractAuth(req: Request) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice(7);

  // let authManager throw if invalid
  return authManager.authenticate(token);
}

export function ExtractClient(req: Request): ClientContext {
  return {
    userAgent: req.headers["user-agent"] ?? "unknown",
    ip: req.ip || req.connection.remoteAddress || "unknown",
    origin: req.headers.origin,
  };
}
