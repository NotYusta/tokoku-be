// migrations/20260126123000-create-product-options.mjs
import { DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("product_options", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "products", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("single", "multiple", "dropdown", "text"),
      allowNull: false,
      defaultValue: "single",
    },

    label: {
      type: DataTypes.STRING(100),
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

  await queryInterface.addIndex("product_options", ["product_id"]);
}

export async function down(queryInterface) {
  // In MariaDB/MySQL, dropping the table removes ENUMs automatically
  await queryInterface.dropTable("product_options");
}
