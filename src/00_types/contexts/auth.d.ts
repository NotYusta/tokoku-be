import type { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  userId: number;
  name: string;
}
