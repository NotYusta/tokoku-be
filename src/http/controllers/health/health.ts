import type { Request, Response } from "express";
import healthService from "../../../services/health/health.js";
import handle from "../../../utils/handler.js";


export const HealthController = {
  getHealth: (req: Request, res: Response) =>
    handle(res, () => {
      const message = healthService.handle();
      return message; // can be sync or async
    }),
};
