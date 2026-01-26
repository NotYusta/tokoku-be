// migrations/XXXXXXXXXXXXXX-add-unique-to-transactions-gateway-ref.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.addConstraint("transactions", {
    fields: ["gateway_ref"],
    type: "unique",
    name: "uniq_transactions_gateway_ref",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint(
    "transactions",
    "uniq_transactions_gateway_ref",
  );
}
