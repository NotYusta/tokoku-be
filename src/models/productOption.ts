// src/models/productOption.ts
import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database.js";
import ProductModel from "./product.js";

export default class ProductOptionModel extends Model<
  InferAttributes<ProductOptionModel>,
  InferCreationAttributes<ProductOptionModel>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare name: string;                  // e.g., "Size", "Color"
  declare type: "single" | "multiple" | "dropdown" | "text"; // frontend type
  declare label: string | null;          // optional UI label
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductOptionModel.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: ProductModel, key: "id" },
      field: "product_id",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: {
      type: DataTypes.ENUM("single", "multiple", "dropdown", "text"),
      allowNull: false,
      defaultValue: "single",
    },
    label: { type: DataTypes.STRING(100), allowNull: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
  },
  {
    sequelize,
    tableName: "product_options",
    underscored: true,
    timestamps: true,
  }
);
