'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },

      // product / service snapshot
      name: {
        type: Sequelize.STRING(191),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },

      total_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'IDR',
      },

      status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },

      payment_method: {
        type: Sequelize.ENUM(
          'midtrans',
          'xendit',
          'paypal',
          'stripe',
          'manual'
        ),
        allowNull: false,
      },

      payment_ref: {
        type: Sequelize.STRING(191),
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);
    await queryInterface.addIndex('orders', ['payment_method']);
    await queryInterface.addIndex('orders', ['payment_ref']);
  },

  async down(queryInterface, Sequelize) {
    // In MariaDB/MySQL, dropping the table automatically removes ENUMs
    await queryInterface.dropTable('orders');
  },
};
