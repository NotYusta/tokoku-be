import { Router, type Express } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
export const registerAdminRoutes = (app: Express) => {
  const adminGroup = Router();
  app.use("/api/admin", adminGroup);

  adminGroup.use(authMiddleware);
};
