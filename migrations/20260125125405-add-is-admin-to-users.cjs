// migrations/20260125121000-add-is-admin-to-users.cjs
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "is_admin", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Indicates if the user has admin privileges",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "is_admin");
  },
};
