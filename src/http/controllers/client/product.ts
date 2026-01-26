// src/controllers/client/product.ts
import type { Request, Response } from "express";

import handle from "../../../utils/handler.js";
import { NotFoundError, ValidationError } from "../../../utils/customErrors.js";
import clientProductService from "../../../services/client/product.js"; // for product info
import { ExtractAuth } from "../../../utils/http.js";
import createOrderProductService from "../../../services/orders/createOrderProduct.js";

const ProductController = {
  // GET /products/:id
  getProduct: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const id = Number(req.params.id);
        if (isNaN(id)) throw new NotFoundError();

        return await clientProductService.getById(id);
      },
      { parseUnhandled: true },
    ),

  // GET /products
  getAllProducts: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const page = req.query.page ? Number(req.query.page) : 1;
        const pageSize = req.query.page_size ? Number(req.query.page_size) : 20;
        const onlyInStock = req.query.only_in_stock === "true";

        if (isNaN(page) || page < 1)
          throw new ValidationError(["Invalid page number"]);
        if (isNaN(pageSize) || pageSize < 1)
          throw new ValidationError(["Invalid page size number"]);

        return await clientProductService.getAll({
          page,
          pageSize,
          onlyInStock,
        });
      },
      { parseUnhandled: true },
    ),

  // POST /products/:id/order
  createOrder: (req: Request, res: Response) =>
    handle(
      res,
      async () => {
        const productId = Number(req.params.id);
        if (isNaN(productId)) throw new ValidationError(["Invalid product id"]);

        const { quantity, selectedOptions } = req.body;

        if (!quantity || quantity < 1)
          throw new ValidationError(["Quantity must be at least 1"]);

        const { uid } = ExtractAuth(req);
        return await createOrderProductService.handle({
          userId: uid,
          productId,
          quantity,
          selectedOptions,
        });
      },
      { parseUnhandled: true },
    ),
};

export default ProductController;
