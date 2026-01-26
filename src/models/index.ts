// src/models/associations.ts
import { sequelize } from "../database.js";
import logger from "../logger.js";
import ProductModel from "./product.js";
import ProductImageModel from "./productImage.js";
import ProductOptionModel from "./productOption.js";
import ProductOptionValueModel from "./productOptionValue.js";

const initAssociations = async () => {
  // ===== Product ↔ Images =====
  ProductModel.hasMany(ProductImageModel, { as: "images", foreignKey: "productId" });
  ProductImageModel.belongsTo(ProductModel, { foreignKey: "productId", as: "product" });

  // ===== Product ↔ Options =====
  ProductModel.hasMany(ProductOptionModel, { as: "options", foreignKey: "productId" });
  ProductOptionModel.belongsTo(ProductModel, { foreignKey: "productId", as: "product" });

  // ===== Option ↔ Option Values =====
  ProductOptionModel.hasMany(ProductOptionValueModel, { as: "values", foreignKey: "optionId" });
  ProductOptionValueModel.belongsTo(ProductOptionModel, { foreignKey: "optionId", as: "option" });
};

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    await initAssociations();
    logger.info("Database connection established successfully.");
  } catch (err) {
    logger.error({ err }, "Unable to connect to the database");
    process.exit(1);
  }
};
