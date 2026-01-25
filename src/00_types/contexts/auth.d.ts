import type { JwtPayload } from "jsonwebtoken";

export interface AuthPayload extends JwtPayload {
  uid: number;
  uname: string;
  uadmin: boolean;
  uag: string;
}
