// src/controllers/auth/login.ts
import type { Request, Response } from "express";

import handle from "../../../utils/handler.js";

const logoutController = (req: Request, res: Response): Promise<void> =>
  handle(res, async () => {
    // Validate & parse request body
    res.clearCookie("auth_token");
    return "Logged out successfully";
  });

export default logoutController;
