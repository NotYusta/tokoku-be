import { Router, type Express } from "express";
import AuthController from "../controllers/auth/index.js";

const authRoutes = (app: Express) => {
  const authGroup = Router();
  app.use("/api/auth", authGroup);

  authGroup.post("/login", AuthController.login);
};

export default authRoutes;
