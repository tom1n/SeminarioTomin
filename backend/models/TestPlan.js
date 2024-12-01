const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const TestPlan = sequelize.define('TestPlan', {
    scenario: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    test_case: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    test_data: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    acceptance_criteria: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pendiente', 'En progreso', 'Completado'),
        defaultValue: 'Pendiente',
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'projects',
            key: 'id',
        },
    },
}, {
    tableName: 'test_plans', // Nombre real de la tabla
    timestamps: false,
});

module.exports = TestPlan;
