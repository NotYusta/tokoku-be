import jwt from "jsonwebtoken";
import config from "../config.js";
import type { AuthPayload } from "../00_types/contexts/auth.js";
import type { TokenResult } from "../00_types/managers/auth.js";

interface GenerateTokenPayload {
  userId: number;
  isAdmin: boolean;
  name: string;
  userAgent: string;
  remember: boolean;
}

class AuthManager {
  private readonly secret: string;

  constructor() {
    this.secret = config.app.keys.jwtSecret;
  }

  public generateToken({
    userId,
    isAdmin,
    name,
    userAgent,
    remember,
  }: GenerateTokenPayload): TokenResult {
    const payload: AuthPayload = {
      uid: userId,
      uadmin: isAdmin,
      uname: name,
      uag: userAgent,
    };

    // Calculate maxAge in milliseconds
    const maxAge = remember
      ? 1000 * 60 * 60 * 24 * 30 // 30 days
      : 1000 * 60 * 60 * 24; // 1 day

    const token = jwt.sign(payload, this.secret, {
      algorithm: "HS256",
      expiresIn: remember ? "30d" : "1d",
    });

    return { token, maxAge };
  }

  public authenticate(token: string, uag: string): AuthPayload {
    try {
      const payload = jwt.verify(token, this.secret) as AuthPayload;

      if (payload.uag !== uag) {
        throw new Error("unmatched user agent");
      }

      return payload;
    } catch {
      throw new Error("invalid_token");
    }
  }
}

const authManager = new AuthManager();
export default authManager;
