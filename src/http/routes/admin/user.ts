import { Router } from "express";
import AdminUserController from "../../controllers/admin/user.js";

const adminUserRoutes = (adminGroup: Router) => {
  // ===== User management routes =====
  const adminUserGroup = Router();
  adminGroup.use("/users", adminUserGroup);

  adminUserGroup.get("/", AdminUserController.getAllUsers); // GET all users
  adminUserGroup.get("/:id", AdminUserController.getUser); // GET single user
  adminUserGroup.post("/", AdminUserController.createUser); // CREATE new user
  adminUserGroup.put("/:id", AdminUserController.updateUser); // UPDATE user
  adminUserGroup.delete("/:id", AdminUserController.deleteUser); // DELETE user
};

export default adminUserRoutes;