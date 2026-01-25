import type { Request, Response, NextFunction } from "express";
import logger from "../../logger.js";
import prettyMs from "pretty-ms";

export default function logMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - start;
    const humanDuration = prettyMs(durationMs, { secondsDecimalDigits: 2 });

    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration: humanDuration,
        ip: req.ip,
      },
      "HTTP request"
    );
  });

  next();
}
