import { Router, type Express } from "express";
import { authMiddleware } from "../../middlewares/auth.js";
export const registerClientRoutes = (app: Express) => {
    const clientGroup = Router();
    app.use("/api/client", clientGroup);
    
    clientGroup.use(authMiddleware);
};
