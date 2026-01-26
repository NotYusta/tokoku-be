// src/models/transaction.ts
import {
  Model,
  DataTypes,
  type CreationOptional,
  type InferCreationAttributes,
  type InferAttributes,
} from "sequelize";
import { sequelize } from "../database.js";

export default class TransactionModel extends Model<
  InferAttributes<TransactionModel>,
  InferCreationAttributes<TransactionModel>
> {
  declare id: CreationOptional<number>;
  declare userId: number;

  // snapshot of product / service at time of purchase
  declare description: string;

  declare amount: number;
  declare currency: string;

  declare status: "pending" | "paid" | "failed";

  // payment gateway info
  declare gateway: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
  declare gatewayRef: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
      get() {
        const rawValue = this.getDataValue("amount");
        return parseFloat(rawValue as unknown as string) || 0;
      },
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
      type: DataTypes.ENUM("midtrans", "xendit", "paypal", "stripe", "manual"),
      allowNull: false,
    },

    gatewayRef: {
      type: DataTypes.STRING(191),
      allowNull: true,
      field: "gateway_ref",
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
    tableName: "transactions",
    underscored: true,
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["status"] },
      { fields: ["gateway"] },
      {
        unique: true,
        fields: ["gateway", "gateway_ref"],
        name: "uniq_gateway_ref",
      },
    ],
  },
);
