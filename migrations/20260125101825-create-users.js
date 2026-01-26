// migrations/20260125120000-create-users.mjs
import { DataTypes, Sequelize } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
    },

    password_hash: {
      type: DataTypes.STRING(191),
      allowNull: false,
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

  // Optional indexes
  await queryInterface.addIndex("users", ["email"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
