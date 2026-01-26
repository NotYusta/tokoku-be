// src/models/transaction.ts
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../database.js";

export interface TransactionAttributes {
  id: number;
  userId: number;

  // snapshot of product / service at time of purchase
  description: string;

  amount: number;
  currency: string;

  status: "pending" | "paid" | "failed";

  // payment gateway info
  gateway: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
  gatewayRef?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionCreationAttributes = Optional<
  TransactionAttributes,
  "id" | "status" | "gatewayRef"
>;

export default class TransactionModel
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: number;
  public userId!: number;

  public description!: string;

  public amount!: number;
  public currency!: string;

  public status!: "pending" | "paid" | "failed";

  public gateway!: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
  public gatewayRef?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TransactionModel.init(
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

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "IDR",
    },

    status: {
      type: DataTypes.ENUM("pending", "paid", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },

    gateway: {
      type: DataTypes.ENUM(
        "midtrans",
        "xendit",
        "paypal",
        "stripe",
        "manual"
      ),
      allowNull: false,
    },

    gatewayRef: {
      type: DataTypes.STRING(191),
      allowNull: true,
      field: "gateway_ref",
    },
  },
  {
    sequelize,
    tableName: "transactions",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["status"] },
      { fields: ["gateway"] },
      { fields: ["gateway_ref"] },
    ],
  }
);
