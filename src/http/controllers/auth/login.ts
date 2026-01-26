// src/controllers/auth/login.ts
import type { Request, Response } from "express";
import Joi from "joi";

import loginAuthService from "../../../services/auth/login.js";
import { ExtractClient } from "../../../utils/http.js";
import handle from "../../../utils/handler.js";
import { ValidationError } from "../../../utils/customErrors.js";

// ===== Joi Schema =====
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  remember: Joi.boolean().optional(),
});

const loginController = (req: Request, res: Response): Promise<void> =>
  handle(res, async () => {
    // Validate & parse request body
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) throw new ValidationError(error.details.map((d) => d.message));

    const { email, password, remember } = value;

    const clientContext = ExtractClient(req);
    const result = await loginAuthService.handle({
      clientContext,
      email,
      password,
      remember,
    });

    // Assign cookie to user
    res.cookie("auth_token", result.token, {
      httpOnly: true, // not accessible via JS
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
      sameSite: "strict", // CSRF protection
      maxAge: result.maxAge,
    });

    return;
  });

export default loginController;
