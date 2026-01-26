// src/routes/admin/adminProductRoutes.ts
import { Router } from "express";
import AdminProductController from "../../controllers/admin/product.js";
import AdminProductOptionController from "../../controllers/admin/productOption.js";
import AdminProductOptionValueController from "../../controllers/admin/productOptionValue.js";
import AdminProductImageController from "../../controllers/admin/productImage.js";

// ===== Products =====
const productRoutes = (adminGroup: Router) => {
  const group = Router();
  adminGroup.use("/products", group);

  group.get("/", AdminProductController.getAllProducts);
  group.get("/:id", AdminProductController.getProduct);
  group.post("/", AdminProductController.createProduct);
  group.put("/:id", AdminProductController.updateProduct);
  group.delete("/:id", AdminProductController.deleteProduct);
};

// ===== Product Options =====
const productOptionRoutes = (adminGroup: Router) => {
  const group = Router();
  adminGroup.use("/product-options", group);

  group.get("/", AdminProductOptionController.getAllOptions);
  group.get("/:id", AdminProductOptionController.getOption);
  group.post("/", AdminProductOptionController.createOption);
  group.put("/:id", AdminProductOptionController.updateOption);
  group.delete("/:id", AdminProductOptionController.deleteOption);
};

// ===== Product Option Values =====
const productOptionValueRoutes = (adminGroup: Router) => {
  const group = Router();
  adminGroup.use("/product-option-values", group);

  group.get("/", AdminProductOptionValueController.getAllValues);
  group.get("/:id", AdminProductOptionValueController.getValue);
  group.post("/", AdminProductOptionValueController.createValue);
  group.put("/:id", AdminProductOptionValueController.updateValue);
  group.delete("/:id", AdminProductOptionValueController.deleteValue);
};

// ===== Product Images =====
const productImageRoutes = (adminGroup: Router) => {
  const group = Router();
  adminGroup.use("/product-images", group);

  group.get("/", AdminProductImageController.getAllImages);
  group.get("/:id", AdminProductImageController.getImage);
  group.post("/", AdminProductImageController.createImage);
  group.put("/:id", AdminProductImageController.updateImage);
  group.delete("/:id", AdminProductImageController.deleteImage);
};

// ===== Main export =====
const adminProductRoutes = (adminGroup: Router) => {
  productRoutes(adminGroup);
  productOptionRoutes(adminGroup);
  productOptionValueRoutes(adminGroup);
  productImageRoutes(adminGroup);
};

export default adminProductRoutes;
