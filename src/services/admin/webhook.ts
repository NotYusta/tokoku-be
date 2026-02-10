
import logger from "../../logger.js"; // your Pino logger instance
import type { IPagination } from "../../00_types/requests/requests.js";
import { NotFoundError } from "../../utils/customErrors.js";
import { Op } from "sequelize";
import WebhookModel from "../../models/webhook.js";

class AdminWebhookService {
  // ===== READ =====
  public async getById(id: number) {
    logger.debug({ id }, "AdminWebhookService.getById called");

    const webhook = await WebhookModel.findByPk(id, {
      attributes: ["id", "label", "url", "createdAt", "updatedAt"],
    });

    if (!webhook) {
      logger.debug({ id }, "Webhook not found in getById");
      throw new NotFoundError();
    }

    logger.debug(
      { id, webhook: { label: webhook.label, url: webhook.url } },
      "Webhook found in getById",
    );
    return webhook;
  }

  public async getAll({ page = 1, pageSize = 20, search }: IPagination = {}) {
    const offset = (page - 1) * pageSize;

    logger.debug(
      { page, pageSize, offset },
      "AdminWebhookService.getAll called with pagination",
    );

    const where: any = {};
    if (search) {
      where[Op.or] = [
        { label: { [Op.like]: `%${search}%` } },
        { url: { [Op.like]: `%${search}%` } },
      ];
    }

    const { rows: webhooks, count: total } = await WebhookModel.findAndCountAll({
      attributes: ["id", "label", "url", "createdAt", "updatedAt"],
      limit: pageSize,
      offset,
      order: [["id", "ASC"]],
      where,
    });

    logger.debug(
      { page, pageSize, returned: webhooks.length, total },
      "AdminWebhookService.getAll completed with pagination",
    );

    return {
      webhooks,
      pagination: {
        total,
        page,
        pageSize,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  // ===== CREATE =====
  public async create(data: {
    label: string,
    url: string,
  }) {
    logger.debug(
      { label: data.label, url: data.url },
      "AdminWebhookService.create called",
    );

    const webhook = await WebhookModel.create({
      label: data.label,
      url: data.url,
    });

    logger.debug({ id: webhook.id }, "AdminWebhookService.create completed");
    return webhook;
  }

  // ===== UPDATE =====
  public async update(
    id: number,
    data: Partial<{
      label: string;
      url: string;
    }>,
  ) {
    logger.debug({ id, data }, "AdminWebhookService.update called");

    const webhook = await WebhookModel.findByPk(id);
    if (!webhook) {
      logger.debug({ id }, "Webhook not found in update");
      throw new NotFoundError();
    }

    await webhook.update(data);

    logger.debug({ id }, "AdminWebhookService.update completed");
    return webhook;
  }

  // ===== DELETE =====
  public async delete(id: number) {
    logger.debug({ id }, "AdminWebhookService.delete called");

    const webhook = await WebhookModel.findByPk(id);
    if (!webhook) {
      logger.debug({ id }, "Webhook not found in delete");
      throw new NotFoundError();
    }

    await webhook.destroy();
    logger.debug({ id }, "AdminWebhookService.delete completed");

    return { success: true };
  }
}

const adminWebhookService = new AdminWebhookService();
export default adminWebhookService;
