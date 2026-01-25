'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
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

      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'IDR',
      },

      status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },

      gateway: {
        type: Sequelize.ENUM(
          'midtrans',
          'xendit',
          'paypal',
          'stripe',
          'manual'
        ),
        allowNull: false,
      },

      gateway_ref: {
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

    await queryInterface.addIndex('transactions', ['user_id']);
    await queryInterface.addIndex('transactions', ['status']);
    await queryInterface.addIndex('transactions', ['gateway']);
    await queryInterface.addIndex('transactions', ['gateway_ref']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');

    // ENUM cleanup (important for Postgres, harmless on MySQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_transactions_status;'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_transactions_gateway;'
    );
  },
};
