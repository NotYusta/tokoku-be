// src/models/product.ts
import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
} from "sequelize";
import { sequelize } from "../database.js";
import ProductImageModel from "./productImage.js";
import ProductOptionModel from "./productOption.js"; // import options

export default class ProductModel extends Model<
  InferAttributes<ProductModel>,
  InferCreationAttributes<ProductModel>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string | null;
  declare price: number; // DECIMAL
  declare stock: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // ===== Associations =====
  declare images?: ProductImageModel[];
  declare getImages: HasManyGetAssociationsMixin<ProductImageModel>;

  declare options?: ProductOptionModel[];
  declare getOptions: HasManyGetAssociationsMixin<ProductOptionModel>;
}

// ===== Init =====
ProductModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      get() {
        const rawValue = this.getDataValue("price");
        return parseFloat(rawValue as unknown as string) || 0;
      },
    },

    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "products",
    underscored: true,
    timestamps: true,
  },
);
