// src/models/orders.ts
import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../database.js";

export interface OrderAttributes {
  id: number;
  userId: number;

  // snapshot of product/service at time of order
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;

  currency: string;

  status: "pending" | "processing" | "completed" | "cancelled";

  paymentMethod: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
  paymentRef?: string;

  payload?: any; // JSON snapshot of product with options

  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderCreationAttributes = Optional<
  OrderAttributes,
  "id" | "description" | "paymentRef" | "status" | "payload"
>;

export default class OrderModel
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: number;
  public userId!: number;

  public name!: string;
  public description?: string;

  public unitPrice!: number;
  public quantity!: number;
  public totalPrice!: number;

  public currency!: string;

  public status!: "pending" | "processing" | "completed" | "cancelled";

  public paymentMethod!: "midtrans" | "xendit" | "paypal" | "stripe" | "manual";
  public paymentRef?: string;

  public payload?: any;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

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

    paymentMethod: {
      type: DataTypes.ENUM(
        "midtrans",
        "xendit",
        "paypal",
        "stripe",
        "manual"
      ),
      allowNull: false,
    },

    paymentRef: {
      type: DataTypes.STRING(191),
      allowNull: true,
      field: "payment_ref",
    },

    payload: {
      type: DataTypes.JSON,
      allowNull: true,
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
      { fields: ["payment_method"] },
      { fields: ["payment_ref"] },
    ],
  }
);
