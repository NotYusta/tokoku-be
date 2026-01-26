// src/models/productOptionValue.ts
import { Model, DataTypes } from "sequelize";
import type { InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import { sequelize } from "../database.js";
import ProductOptionModel from "./productOption.js";

export default class ProductOptionValueModel extends Model<
  InferAttributes<ProductOptionValueModel>,
  InferCreationAttributes<ProductOptionValueModel>
> {
  declare id: CreationOptional<number>;
  declare optionId: number;
  declare name: string;         
  declare price: number;        
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductOptionValueModel.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    optionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: ProductOptionModel, key: "id" },
      field: "option_id",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
  },
  {
    sequelize,
    tableName: "product_option_values",
    underscored: true,
    timestamps: true,
  }
);
