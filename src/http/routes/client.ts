import { Router, type Express } from "express";
import authMiddleware from "../middlewares/auth.js";
import ClientAccountController from "../controllers/client/account.js";

const clientRoutes = (app: Express) => {
  const clientGroup = Router();
  app.use("/api/client", clientGroup);
  clientGroup.use(authMiddleware);

  clientGroup.get("/account", ClientAccountController.getAccount);
};

export default clientRoutes;
