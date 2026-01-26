import type { Request, Response } from "express";
import handle from "../../../utils/handler.js";

import config from "../../../config.js";
import { ForbiddenError } from "../../../utils/customErrors.js";
import xenditPaymentService from "../../../services/payment/xendit.js";

export const WebhookController = {
  xendit: (req: Request, res: Response) =>
    handle(res, async () => {
      const webhookToken = req.headers["x-callback-token"];

      if (webhookToken !== config.paymentGateway.xendit.webhookToken) {
        throw new ForbiddenError();
      }

      // pass payload to webhook handler
      await xenditPaymentService.handleWebhook(req.body);

      return;
    }),
};
