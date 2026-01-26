// migrations/20260125121000-add-is-admin-to-users.mjs
import { DataTypes } from "sequelize";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("users", "is_admin", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: "Indicates if the user has admin privileges",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("users", "is_admin");
}
