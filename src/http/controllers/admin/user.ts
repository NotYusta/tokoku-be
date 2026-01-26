// src/controllers/admin/user.ts
import type { Request, Response } from "express";
import Joi from "joi";

import adminUserService from "../../../services/admin/user.js";
import { ExtractAuth } from "../../../utils/http.js";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  isAdmin: Joi.boolean().optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  isAdmin: Joi.boolean().optional(),
});

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
        const { error, value } = paginationSchema.validate(req.query);
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminUserService.getAll({
          page: value.page,
          pageSize: value.page_size,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/users
  createUser: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = createUserSchema.validate(req.body, { abortEarly: false });
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminUserService.create(value);
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

        const { uid } = ExtractAuth(req);
        if (uid === id) {
          throw new ValidationError(["You cannot modify your own user!"]);
        }

        const { error, value } = updateUserSchema.validate(req.body, { abortEarly: false });
        if (error) throw new ValidationError(error.details.map((d) => d.message));

        return await adminUserService.update(id, value);
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
