// src/controllers/admin/user.ts
import type { Request, Response } from "express";
import Joi from "joi";
import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import adminWebhookService from "../../../services/admin/webhook.js";

// ===== Joi Schemas =====
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  page_size: Joi.number().integer().min(1).default(20),
  search: Joi.string().optional().allow(""),
});

const createUserSchema = Joi.object({
  label: Joi.string().required(),
  url: Joi.string().required(),
});

const updateUserSchema = Joi.object({
  label: Joi.string().optional(),
  url: Joi.string().optional(),
});

const AdminWebhookController = {
  // GET /admin/webhooks/:id
  getWebhook: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminWebhookService.getById(id);
      },
      { parseUnhandled: true },
    ),

  // GET /admin/webhooks
  getAllWebhooks: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = paginationSchema.validate(req.query);
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        return await adminWebhookService.getAll({
          page: value.page,
          pageSize: value.page_size,
          search: value.search,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /admin/webhooks
  createWebhook: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const { error, value } = createUserSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        return await adminWebhookService.create(value);
      },
      { parseUnhandled: true },
    ),

  // PUT /admin/webhooks/:id
  updateWebhook: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();


        const { error, value } = updateUserSchema.validate(req.body, {
          abortEarly: false,
        });
        if (error)
          throw new ValidationError(error.details.map((d) => d.message));

        return await adminWebhookService.update(id, value);
      },
      { parseUnhandled: true },
    ),

  // DELETE /admin/webhooks/:id
  deleteWebhook: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await adminWebhookService.delete(id);
      },
      { parseUnhandled: true },
    ),
};

export default AdminWebhookController;
