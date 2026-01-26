import bcrypt from "bcrypt";
import UserModel from "../../models/user.js";
import authManager from "../../managers/auth.js";
import type { ClientContext } from "../../00_types/contexts/client.js";
import {
  UnprocessableError,
} from "../../utils/customErrors.js";

interface SignupPayload {
  clientContext: ClientContext;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  remember?: boolean;
}

class SignupAuthService {
  public async handle({
    clientContext,
    first_name,
    last_name,
    email,
    password,
    remember,
  }: SignupPayload) {
    // Combine first and last name
    const name = `${first_name} ${last_name}`.trim();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      throw new UnprocessableError("Email already in use");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = await UserModel.create({
      name,
      email,
      passwordHash,
      isAdmin: false, // default to regular user
    });

    // Generate JWT token
    const result = authManager.generateToken({
      userId: user.id,
      isAdmin: user.isAdmin,
      userAgent: clientContext.userAgent,
      name: user.name,
      remember: remember === true,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: result.token,
      maxAge: result.maxAge,
    };
  }
}

const signupAuthService = new SignupAuthService();
export default signupAuthService;
