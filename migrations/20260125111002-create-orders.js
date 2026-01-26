// migrations/20260126120000-create-orders.mjs
import { DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("orders", {
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

    // product / service snapshot
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    unit_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    total_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
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

    payment_method: {
      type: DataTypes.ENUM("midtrans", "xendit", "paypal", "stripe", "manual"),
      allowNull: false,
    },

    payment_ref: {
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

  await queryInterface.addIndex("orders", ["user_id"]);
  await queryInterface.addIndex("orders", ["status"]);
  await queryInterface.addIndex("orders", ["payment_method"]);
  await queryInterface.addIndex("orders", ["payment_ref"]);
}

export async function down(queryInterface) {
  // In MariaDB/MySQL, dropping the table automatically removes ENUMs
  await queryInterface.dropTable("orders");
}
