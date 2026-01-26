// migrations/20260126121000-create-transactions.mjs
import { DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("transactions", {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
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
      type: DataTypes.ENUM("midtrans", "xendit", "paypal", "stripe", "manual"),
      allowNull: false,
    },

    gateway_ref: {
      type: DataTypes.STRING(191),
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

  await queryInterface.addIndex("transactions", ["user_id"]);
  await queryInterface.addIndex("transactions", ["status"]);
  await queryInterface.addIndex("transactions", ["gateway"]);
  await queryInterface.addIndex("transactions", ["gateway_ref"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("transactions");
}
