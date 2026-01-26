
import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("job_queues", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "pending",
    },
    attempts: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    run_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("job_queues");
}
