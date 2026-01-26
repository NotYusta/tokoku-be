import type { Request, Response } from "express";
import { ExtractAuth } from "../../../utils/http.js";
import getAccountService from "../../../services/client/account/getAccount.js";
import handle from "../../../utils/handler.js";

const getAccount = (req: Request, res: Response): Promise<void> =>
  handle(res, async () => {
    const authPayload = ExtractAuth(req);

    return await getAccountService.handle(authPayload);
  });

const ClientAccountController = {
  getAccount,
};

export default ClientAccountController;
