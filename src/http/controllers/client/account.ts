import type { Request, Response } from "express";
import {  handle } from "../../../utils/handler.js";
import { ExtractAuth } from "../../../utils/http.js";
import getAccountService from "../../../services/clients/account/getAccount.js";

const getAccount = (req: Request, res: Response): Promise<void> =>
  handle(res, async () => {
    const authPayload = ExtractAuth(req);

    return await getAccountService.handle(authPayload);
  });

const ClientAccountController = {
  getAccount,
};

export default ClientAccountController;
