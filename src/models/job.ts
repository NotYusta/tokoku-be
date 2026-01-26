// src/models/jobQueue.ts
import { Model, DataTypes } from "sequelize";
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../database.js";

export default class JobQueueModel extends Model<
  InferAttributes<JobQueueModel>,
  InferCreationAttributes<JobQueueModel>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare payload: object; // JSON payload
  declare status: string; // "pending" | "processing" | "completed" | "failed"
  declare attempts: number;
  declare runAt: CreationOptional<Date>;
  declare finishedAt: CreationOptional<Date | null>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

JobQueueModel.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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

    runAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "run_at",
    },

    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "finished_at",
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "job_queues",
    underscored: true,
    timestamps: true,
  },
);
