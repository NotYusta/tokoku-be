// migrations/20260126-add-value-to-product_option_values.js

import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.addColumn(
    "product_option_values",
    "value",
    {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "", // or use a default based on your needs
      after: "name", // place this column immediately after 'name'
    }
  );
}

export async function down(queryInterface) {
  await queryInterface.removeColumn("product_option_values", "value");
}
