// migrations/20260126121500-add-payload-to-orders.mjs
import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.addColumn("orders", "payload", {
    type: DataTypes.JSON,
    allowNull: true,
    comment: "Snapshot of product/service options at order time",
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("orders", "payload");
}
