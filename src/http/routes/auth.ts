import { Router, type Express } from "express";
import AuthController from "../controllers/auth/00_auth.js";
import corsMiddleware from "../middlewares/cors.js";
import authMiddleware from "../middlewares/auth.js";

const authRoutes = (app: Express) => {
  const authGroup = Router();
  app.use("/api/auth", authGroup);

  authGroup.use(corsMiddleware);
  authGroup.post("/login", AuthController.loginController);
  authGroup.post("/signup", AuthController.signupController); // new signup route
  authGroup.get("/logout", authMiddleware, AuthController.logoutController); // new signup route
};

export default authRoutes;
