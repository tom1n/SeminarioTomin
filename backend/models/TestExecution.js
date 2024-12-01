const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TestExecution = sequelize.define(
    'TestExecution',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        testplan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'test_plans', // Nombre de la tabla referenciada
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        status: {
            type: DataTypes.ENUM('Éxito', 'Falla'),
            allowNull: false,
        },
        observations: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        execution_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: 'test_executions',
        timestamps: false, // No necesitamos `createdAt` ni `updatedAt`
    }
);

module.exports = TestExecution;
