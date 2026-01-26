import type { Request, Response } from "express";
import adminUserService from "../../../services/admin/user.js";

import { ExtractAuth } from "../../../utils/http.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

const AdminUserController = {
  // GET /admin/users/:id
  getUser: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminUserService.getById(id);
      },
      { parseUnhandled: true },
    ),

  // GET /admin/users
  getAllUsers: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        // Extract page and page size from query parameters, default to 1 and 20
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page Size number"]);

        return await adminUserService.getAll({ page, pageSize });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/users
  createUser: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { name, email, password, isAdmin } = req.body;
        return await adminUserService.create({
          name,
          email,
          password,
          isAdmin,
        });
      },
      { parseUnhandled: true },
    ),

  // PUT /admin/users/:id
  updateUser: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { name, email, password, isAdmin } = req.body;
        const { uid } = ExtractAuth(req);
        if (uid === id) {
          throw new ValidationError(["You cannot modify your own user!"]);
        }
        
        return await adminUserService.update(id, {
          name,
          email,
          password,
          isAdmin,
        });
      },
      { parseUnhandled: true },
    ),

  // DELETE /admin/users/:id
  deleteUser: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        const { uid } = ExtractAuth(req);
        if (uid === id) {
          throw new ValidationError(["You cannot modify your own user!"]);
        }

        return await adminUserService.delete(id);
      },
      { parseUnhandled: true },
    ),
};

export default AdminUserController;
