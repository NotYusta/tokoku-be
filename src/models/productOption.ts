// src/models/productOption.ts
import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../database.js";
import ProductOptionValueModel from "./productOptionValue.js"; // import values model

export default class ProductOptionModel extends Model<
  InferAttributes<ProductOptionModel>,
  InferCreationAttributes<ProductOptionModel>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare name: string; // e.g., "Size", "Color"
  declare type: "multiple" | "dropdown" | "text"; // frontend type
  declare label: string | null; // optional UI label
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // ===== Associations =====
  declare values?: ProductOptionValueModel[]; // Option can have multiple values
  declare getValues: HasManyGetAssociationsMixin<ProductOptionValueModel>; // Sequelize helper
}

ProductOptionModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "product_id",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    type: {
      type: DataTypes.ENUM("multiple", "dropdown", "text"),
      allowNull: false,
      defaultValue: "dropdown",
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
  },
);
