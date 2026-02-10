import { DataTypes, Model, Sequelize, type CreationOptional, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { sequelize } from "../database.js";

export default class WebhookModel extends Model<InferAttributes<WebhookModel>, InferCreationAttributes<WebhookModel>> {
    declare id: CreationOptional<number>;
    declare label: string;
    declare url: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

WebhookModel.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING(191),
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING(1024),
            allowNull: false,
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
        tableName: "webhooks",
        timestamps: true,
    }
);
