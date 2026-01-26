// src/models/productImage.ts
import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database.js";


export default class ProductImageModel extends Model<
  InferAttributes<ProductImageModel>,
  InferCreationAttributes<ProductImageModel>
> {
  declare id: CreationOptional<number>;
  declare productId: number;
  declare url: string;                     // image URL
  declare altText: string | null;          // optional alt text
  declare isPrimary: boolean;              // mark main image
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductImageModel.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    productId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "product_id",
    },
    url: { type: DataTypes.STRING(255), allowNull: false },
    altText: { type: DataTypes.STRING(255), allowNull: true, field: "alt_text" },
    isPrimary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "is_primary" },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
  },
  {
    sequelize,
    tableName: "product_images",
    underscored: true,
    timestamps: true,
  }
);
