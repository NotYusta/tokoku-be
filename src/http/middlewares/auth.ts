// src/auth/middleware.ts
import type { Request, Response, NextFunction } from "express";
import logger from "../../logger.js";
import authManager from "../../managers/auth.js";
import { ExtractClient } from "../../utils/http.js";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    logger.debug("[authMiddleware] No cookie header found");
    return res.status(401).json({ error: "missing_token" });
  }

  // Parse cookies
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map(c => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    })
  );

  const token = cookies["auth_token"];
  if (!token) {
    logger.debug({ cookies }, "[authMiddleware] auth_token not found in cookies");
    return res.status(401).json({ error: "missing_token" });
  }

  const clientContext = ExtractClient(req);

  try {
    const payload = authManager.authenticate(token, clientContext.userAgent);

    // Attach authenticated payload to request
    req.auth = payload;

    logger.debug({ uid: payload.uid }, "[authMiddleware] Authentication successful");
    return next();
  } catch (err) {
    logger.debug({ err }, "[authMiddleware] Authentication failed");
    return res.status(403).json({ error: "invalid_token" });
  }
}
