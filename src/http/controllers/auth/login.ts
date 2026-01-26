import type { Request, Response } from "express";

import { validateAndParse } from "../../../utils/validation.js";
import loginAuthService from "../../../services/auth/login.js";
import { ExtractClient } from "../../../utils/http.js";
import handle from "../../../utils/handler.js";

interface LoginBody {
  email: string;
  password: string;
  remember?: boolean;
}

const loginController = (req: Request, res: Response): Promise<void> =>
  handle(res, async () => {
    // Validate & parse request body
    const { email, password, remember } = validateAndParse<LoginBody>(req, [
      "email",
      "password",
    ]);

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
