// migrations/20260126130000-update-orders-transaction-id.mjs
import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    // remove old indexes (ignore if missing)
    await queryInterface
      .removeIndex("orders", ["payment_method"], { transaction })
      .catch(() => {});
    await queryInterface
      .removeIndex("orders", ["payment_ref"], { transaction })
      .catch(() => {});

    // remove old columns
    await queryInterface.removeColumn("orders", "payment_method", {
      transaction,
    });
    await queryInterface.removeColumn("orders", "payment_ref", {
      transaction,
    });

    // add transaction_id
    await queryInterface.addColumn(
      "orders",
      "transaction_id",
      {
        type: DataTypes.STRING(191),
        allowNull: true,
        defaultValue: null,
      },
      { transaction },
    );

    // add index for transaction_id
    await queryInterface.addIndex("orders", ["transaction_id"], {
      transaction,
    });
  });
}

export async function down(queryInterface) {
  await queryInterface.sequelize.transaction(async (transaction) => {
    // remove transaction_id index & column
    await queryInterface.removeIndex("orders", ["transaction_id"], {
      transaction,
    });
    await queryInterface.removeColumn("orders", "transaction_id", {
      transaction,
    });

    // restore payment_method
    await queryInterface.addColumn(
      "orders",
      "payment_method",
      {
        type: DataTypes.ENUM(
          "midtrans",
          "xendit",
          "paypal",
          "stripe",
          "manual",
        ),
        allowNull: false,
      },
      { transaction },
    );

    // restore payment_ref
    await queryInterface.addColumn(
      "orders",
      "payment_ref",
      {
        type: DataTypes.STRING(191),
        allowNull: true,
        defaultValue: null,
      },
      { transaction },
    );

    // restore indexes
    await queryInterface.addIndex("orders", ["payment_method"], {
      transaction,
    });
    await queryInterface.addIndex("orders", ["payment_ref"], { transaction });
  });
}
