// src/models/associations.ts
import { sequelize } from "../database.js";
import logger from "../logger.js";
import ProductModel from "./product.js";
import ProductImageModel from "./productImage.js";

const initAssociations = async () => {
  try {
    await sequelize.authenticate();

    logger.info("Database connection established successfully.");
    // Define associations here, after both models are fully initialized
    ProductModel.hasMany(ProductImageModel, {
      as: "images",
      foreignKey: "productId",
    });
    ProductImageModel.belongsTo(ProductModel, { foreignKey: "productId" });
  } catch (err) {
    logger.error({ err }, "Unable to connect to the database");
    process.exit(1); // optional: exit if DB fails
  }
};

export const initDatabase = async () => {
  await initAssociations();
};
