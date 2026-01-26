// src/models/orders.ts
import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../database.js";

export default class OrderModel extends Model<
  InferAttributes<OrderModel>,
  InferCreationAttributes<OrderModel>
> {
  // ===== Fields =====
  declare id: CreationOptional<number>;
  declare userId: number;

  declare name: string;
  declare description: string | null;

  declare unitPrice: number;
  declare quantity: number;
  declare totalPrice: number;

  declare currency: string;

  declare status: "pending" | "processing" | "completed" | "cancelled";

  // unified transaction reference
  declare transactionId: string | null;

  declare payload: any | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

// ===== Init =====
OrderModel.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: "user_id",
    },

    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    unitPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "unit_price",
    },

    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    totalPrice: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: "total_price",
      defaultValue: 0,
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "IDR",
    },

    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },

    transactionId: {
      type: DataTypes.STRING(191),
      allowNull: true,
      field: "transaction_id",
      defaultValue: null,
    },

    payload: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
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
    tableName: "orders",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["status"] },
      { fields: ["transaction_id"] },
    ],
  },
);
