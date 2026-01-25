// bikin stateless aja dulu, males nyimpen session di db

import jwt from "jsonwebtoken";
import config from "../config.js";
import type { AuthPayload } from "../00_types/contexts/auth.js";

class AuthManager {
  private readonly secret: string;

  constructor() {
    this.secret = config.app.keys.jwtSecret;
  }

  public generateToken(
    userId: number,
    name: string,
    remember: boolean,
  ): string {
    const payload: AuthPayload = {
      userId,
      name,
    };

    return jwt.sign(payload, this.secret, {
      algorithm: "HS256",
      expiresIn: remember ? "30d" : "1d",
    });
  }

  public authenticate(token: string): AuthPayload {
    try {
      return jwt.verify(token, this.secret) as AuthPayload;
    } catch {
      throw new Error("invalid_token");
    }
  }
}

export const authManager = new AuthManager();
