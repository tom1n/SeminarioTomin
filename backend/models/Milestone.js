const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Milestone = sequelize.define('Milestone', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pendiente', 'Completo'),
        defaultValue: 'Pendiente',
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false, // Desactiva createdAt y updatedAt
});

module.exports = Milestone;

