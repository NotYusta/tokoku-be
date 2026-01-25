import bcrypt from "bcrypt";
import { AuthError } from "../../utils/handler.js";
import { UserModel } from "../../models/user.js";
import authManager from "../../managers/auth.js";
import type { ClientContext } from "../../00_types/contexts/client.js";

interface LoginPayload {
  clientContext: ClientContext;
  email: string;
  password: string;
  remember?: boolean;
}

class LoginAuthService {
  public async handle({
    clientContext,
    email,
    password,
    remember,
  }: LoginPayload) {
    // Find user by email
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      throw new AuthError("Invalid email or password");
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AuthError("Invalid email or password");
    }

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

const loginAuthService = new LoginAuthService();
export default loginAuthService;
