import type { Request, Response } from "express";
import handle from "../../../utils/handler.js";
import { ExtractClient } from "../../../utils/http.js";
import signupAuthService from "../../../services/auth/signUp.js";
import Joi from "joi";
import { BadRequestError } from "../../../utils/customErrors.js";


// Joi schema for signup validation
const signupSchema = Joi.object({
  first_name: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.empty": "first_name is required",
      "string.pattern.base": "first_name can only contain letters with no spaces",
    }),
  last_name: Joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      "string.empty": "last_name is required",
      "string.pattern.base": "last_name can only contain letters with no spaces",
    }),
  email: Joi.string().email().required().messages({
    "string.empty": "email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "password is required",
    "string.min": "password must be at least 8 characters",
  }),
  remember: Joi.boolean().optional(),
});

const signupController = (req: Request, res: Response): Promise<void> =>
  handle(res, async () => {
    // Validate request body using Joi
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false });

    if (error) {
      // Combine all error messages into one string
      throw new BadRequestError(error.details.map((d) => d.message).join("\n"));
    }

    const { first_name, last_name, email, password, remember } = value;

    const clientContext = ExtractClient(req);
    const result = await signupAuthService.handle({
      clientContext,
      first_name,
      last_name,
      email,
      password,
      remember,
    });

    // Assign cookie to user
    res.cookie("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: result.maxAge,
    });

    return;
  });

export default signupController;
