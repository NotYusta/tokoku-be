// migrations/20260126124500-update-product-options-type.mjs
import { Sequelize } from "sequelize";

export async function up(queryInterface) {
  // 1. Update existing rows with 'single' type to 'dropdown'
  await queryInterface.sequelize.query(`
    UPDATE product_options
    SET type = 'dropdown'
    WHERE type = 'single';
  `);

  // 2. Change ENUM to remove 'single' and set default to 'dropdown'
  // Note: MySQL does not allow direct ENUM modification, so we recreate the column
  await queryInterface.changeColumn("product_options", "type", {
    type: Sequelize.ENUM("multiple", "dropdown", "text"),
    allowNull: false,
    defaultValue: "dropdown",
  });
}

export async function down(queryInterface) {
  // Revert ENUM to add 'single' back and default to 'single'
  await queryInterface.changeColumn("product_options", "type", {
    type: Sequelize.ENUM("single", "multiple", "dropdown", "text"),
    allowNull: false,
    defaultValue: "single",
  });

  // Optionally revert previously updated rows
  await queryInterface.sequelize.query(`
    UPDATE product_options
    SET type = 'single'
    WHERE type = 'dropdown';
  `);
}
