import {  NotFoundError } from "../../../utils/handler.js";
import UserModel from "../../../models/user.js";
import type { AuthPayload } from "../../../00_types/contexts/auth.js";

class GetAccountService {
  public async handle(authPayload: AuthPayload) {
    // Find user by ID from the auth payload
    const user = await UserModel.findByPk(authPayload.uid, {
      attributes: ["id", "name", "email"], // only public fields
    });

    if (!user) {
      throw new NotFoundError();
    }

    return user;
  }
}

const getAccountService = new GetAccountService();
export default getAccountService;
