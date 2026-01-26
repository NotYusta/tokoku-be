import { Router, type Express } from "express";
import AuthController from "../controllers/auth/00_auth.js";

const authRoutes = (app: Express) => {
  const authGroup = Router();
  app.use("/api/auth", authGroup);

  authGroup.post("/login", AuthController.login);
  authGroup.post("/signup", AuthController.signUp); // new signup route
};

export default authRoutes;
