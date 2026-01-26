import path from "path";
import config from "../../config.js";
import { sequelize } from "../../database.js";
import transactionFailedEvent from "../../events/transactions/fail.js";
import transactionPaidEvent from "../../events/transactions/paid.js";
import logger from "../../logger.js";
import OrderModel from "../../models/order.js";
import TransactionModel from "../../models/transaction.js";
import { NotFoundError } from "../../utils/customErrors.js";

const XENDIT_BASE = "https://api.xendit.co/v2";
class XenditPaymentService {
  private authHeader: string;

  constructor() {
    // Cache the Base64 auth header
    this.authHeader = `Basic ${Buffer.from(`${config.paymentGateway.xendit.apiKey}:`).toString("base64")}`;
    logger.debug({key: config.paymentGateway.xendit.apiKey}, "checking api key")
  }

  public async createInvoice(params: {
    userId: number;
    description: string;
    amount: number;
    currency?: string;
    payerEmail?: string;
    redirectUrl?: string;
  }) {
    const {
      userId,
      description,
      amount,
      currency = "IDR",
      payerEmail,
      redirectUrl
    } = params;

    const tx = await sequelize.transaction();

    try {
      // ===== 1. Create transaction in DB =====
      const transaction = await TransactionModel.create(
        {
          userId,
          description,
          amount,
          currency,
          status: "pending",
          gateway: "xendit",
          gatewayRef: null,
        },
        { transaction: tx },
      );

      // ===== 2. Call Xendit API =====
      const res = await fetch(`${XENDIT_BASE}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.authHeader, // use cached header
        },
        body: JSON.stringify({
          external_id: `tx-${transaction.id}`,
          amount,
          payer_email: payerEmail,
          description,
          should_send_email: true,
          success_redirect_url: redirectUrl,
        }),
      });

      const invoice = await res.json();

      if (!res.ok) {
        logger.error({ invoice }, "Xendit invoice creation failed");
        throw new Error(invoice.message || "Failed to create Xendit invoice");
      }

      // ===== 3. Update transaction with Xendit invoice id =====
      transaction.gatewayRef = invoice.id;
      await transaction.save({ transaction: tx });

      await tx.commit();

      return {
        transaction,
        url: invoice.invoice_url,
      };
    } catch (err: any) {
      await tx.rollback();
      logger.error(
        { err },
        "Xendit invoice creation failed, rolled back DB transaction",
      );
      throw new Error("Failed to create Xendit invoice");
    }
  }

  public async handleWebhook(payload: any) {
    const gatewayRef = payload.id;
    const status = payload.status;

    // find transaction by gateway ref
    const transaction = await TransactionModel.findOne({
      where: { gatewayRef },
    });

    if (!transaction) {
      logger.warn({ gatewayRef }, "Transaction not found for Xendit webhook");
      throw new NotFoundError();
    }

    // idempotency: ignore if already final
    if (transaction.status !== "pending") {
      logger.debug(
        { transactionId: transaction.id, status: transaction.status },
        "Transaction already finalized",
      );
      return;
    }

    if (status === "PAID") {
      // 1️⃣ mark transaction paid
      await transaction.update({ status: "paid" });

      // 2️⃣ mark order completed
      await OrderModel.update(
        { status: "completed" },
        { where: { transactionId: String(transaction.id) } },
      );

      logger.info(
        { transactionId: transaction.id },
        "Xendit payment marked as PAID",
      );

      transactionPaidEvent.emit(transaction);
    } else if (status === "EXPIRED") {
      // 1️⃣ mark transaction failed
      await transaction.update({ status: "failed" });

      // 2️⃣ cancel order
      await OrderModel.update(
        { status: "cancelled" },
        { where: { transactionId: String(transaction.id) } },
      );

      logger.info(
        { transactionId: transaction.id },
        "Xendit payment marked as EXPIRED",
      );

      transactionFailedEvent.emit(transaction);
    }
  }
}

const xenditPaymentService = new XenditPaymentService();
export default xenditPaymentService;
