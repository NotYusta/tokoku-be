import type { Request, Response } from "express";
import healthService from "../../../services/health/health.js";

export const HealthController = {
  getHealth: (req: Request, res: Response): void => {
    try {
      const message = healthService.execute();
      res.status(200).json({ data: message });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  },
};
