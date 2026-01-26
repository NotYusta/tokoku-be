// src/models/productOptionValue.ts
import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../database.js";

export default class ProductOptionValueModel extends Model<
  InferAttributes<ProductOptionValueModel>,
  InferCreationAttributes<ProductOptionValueModel>
> {
  declare id: CreationOptional<number>;
  declare optionId: number;
  declare name: string;
  declare value: string; // <-- new field
  declare price: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ProductOptionValueModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    optionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: "option_id",
    },
    name: { type: DataTypes.STRING(100), allowNull: false },
    value: { type: DataTypes.STRING(255), allowNull: false }, // <-- new column
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      get() {
        const rawValue = this.getDataValue("price");
        return parseFloat(rawValue as unknown as string) || 0;
      },
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, field: "created_at" },
    updatedAt: { type: DataTypes.DATE, allowNull: false, field: "updated_at" },
  },
  {
    sequelize,
    tableName: "product_option_values",
    underscored: true,
    timestamps: true,
  },
);
