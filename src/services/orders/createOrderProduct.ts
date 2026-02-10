// src/services/client/createOrderProductService.ts
import path from "path";
import logger from "../../logger.js";

import OrderModel from "../../models/order.js";
import ProductModel from "../../models/product.js";
import ProductOptionModel from "../../models/productOption.js";
import ProductOptionValueModel from "../../models/productOptionValue.js";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableError,
} from "../../utils/customErrors.js";
import xenditPaymentService from "../payment/xendit.js";
import config from "../../config.js";
import { sequelize } from "../../database.js";
import type { ICreateOrderProductPayload } from "../../00_types/domains/orders/createOrderProduct.js";
import orderCreatedEvent from "../../events/orders/create.js";

class CreateOrderProductService {
  public async handle(payload: ICreateOrderProductPayload) {
    const {
      userId,
      productId,
      quantity,
      selectedOptions = [],
      payerEmail,
    } = payload;

    logger.debug(
      { userId, productId, quantity, selectedOptions },
      "CreateOrderProductService called",
    );

    // ===== 1. Fetch product with options and values =====
    const product = await ProductModel.findByPk(productId, {
      include: [
        {
          model: ProductOptionModel,
          as: "options",
          include: [{ model: ProductOptionValueModel, as: "values" }],
        },
      ],
    });

    if (!product) throw new NotFoundError("Product not found");
    if (product.stock < quantity)
      throw new UnprocessableError("Insufficient stock");

    // ===== 2. Validate all product options are selected and type rules =====
    const optionsMap = new Map<number, ProductOptionModel>();
    product.options?.forEach((o) => optionsMap.set(o.id, o));

    const missingOptions = product.options?.filter(
      (o) => !selectedOptions.some((so) => so.optionId === o.id),
    );
    if (missingOptions && missingOptions.length > 0) {
      throw new BadRequestError(
        `Missing selections for option(s): ${missingOptions.map((o) => o.name).join(", ")}`,
      );
    }

    // ===== 2a. Validate each selected option against its type =====
    for (const opt of selectedOptions) {
      const option = optionsMap.get(opt.optionId);
      if (!option)
        throw new BadRequestError(
          `Option with id ${opt.optionId} does not exist for this product`,
        );

      const hasValues = opt.valueIds && opt.valueIds.length > 0;
      const hasCustom = opt.customValue && opt.customValue.trim() !== "";

      switch (option.type) {
        case "dropdown":
          if (!(hasValues || hasCustom)) {
            throw new BadRequestError(
              `Option "${option.name}" requires exactly one value`,
            );
          }
          if (
            (hasValues && opt.valueIds!.length !== 1) ||
            (hasValues && hasCustom)
          ) {
            throw new BadRequestError(
              `Option "${option.name}" allows only one selection`,
            );
          }
          break;

        case "multiple":
          if (!(hasValues || hasCustom)) {
            throw new BadRequestError(
              `Option "${option.name}" requires at least one value`,
            );
          }
          break;

        case "text":
          if (!hasCustom) {
            throw new BadRequestError(
              `Option "${option.name}" requires a custom value`,
            );
          }
          if (hasValues) {
            throw new BadRequestError(
              `Option "${option.name}" does not allow predefined values`,
            );
          }
          break;

        default:
          throw new BadRequestError(`Unknown option type for "${option.name}"`);
      }

      // ===== 2b. Validate valueIds exist =====
      if (opt.valueIds) {
        const valueIdsSet = new Set(option.values?.map((v) => v.id));
        for (const valueId of opt.valueIds) {
          if (!valueIdsSet.has(valueId)) {
            throw new BadRequestError(
              `Value with id ${valueId} does not exist for option ${option.name}`,
            );
          }
        }
      }
    }

    // ===== 3. Validate valueIds exist =====
    for (const opt of selectedOptions) {
      const option = optionsMap.get(opt.optionId);
      if (!option)
        throw new BadRequestError(
          `Option with id ${opt.optionId} does not exist for this product`,
        );

      if (opt.valueIds) {
        const valueIdsSet = new Set(option.values?.map((v) => v.id));
        for (const valueId of opt.valueIds) {
          if (!valueIdsSet.has(valueId)) {
            throw new BadRequestError(
              `Value with id ${valueId} does not exist for option ${option.name}`,
            );
          }
        }
      }
    }

    // ===== 4. Calculate total price and build payload =====
    let totalPrice = product.price * quantity;

    const itemPayload = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      options: [] as any[],
    };

    for (const opt of selectedOptions) {
      const option = optionsMap.get(opt.optionId)!;

      const optionEntry: any = {
        optionId: option.id,
        name: option.name,
        values: [],
      };

      if (opt.valueIds) {
        for (const valueId of opt.valueIds) {
          const value = option.values!.find((v) => v.id === valueId)!;
          optionEntry.values.push({
            name: value.name,
            value: value.value,
            price: value.price,
          });
          totalPrice += value.price * quantity;
        }
      }

      if (opt.customValue) {
        const normalizedValue = opt.customValue
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_");
        optionEntry.values.push({
          name: opt.customValue,
          value: normalizedValue,
          price: 0.0,
        });
      }

      itemPayload.options.push(optionEntry);
    }

    // ===== 5. Transactional save =====
    return await sequelize.transaction(async (t) => {
      const order = await OrderModel.create(
        {
          userId,
          name: product.name,
          description: product.description,
          unitPrice: product.price,
          quantity,
          totalPrice,
          currency: "IDR",
          status: "pending",
          payload: [itemPayload],
        },
        { transaction: t },
      );

      logger.debug({ orderId: order.id, totalPrice }, "Order created");

      const redirectUrl = `${config.app.url}/orders/${order.id}`;
      const invoice = await xenditPaymentService.createInvoice({
        userId,
        description: `Order #${order.id} - ${order.name}`,
        amount: Number(order.totalPrice),
        currency: order.currency,
        payerEmail,
        redirectUrl,
      });

      await order.update(
        { transactionId: String(invoice.transaction.id) },
        { transaction: t },
      );

      logger.info(
        {
          orderId: order.id,
          invoiceId: invoice.transaction.gatewayRef,
          redirectUrl,
        },
        "Order + Xendit invoice created successfully",
      );

      orderCreatedEvent.emit(order);

      return {
        order,
        url: invoice.url,
      };
    });
  }
}

const createOrderProductService = new CreateOrderProductService();
export default createOrderProductService;
