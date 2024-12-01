const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Project = sequelize.define('Project', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Obligatorio
    },
    description: {
        type: DataTypes.TEXT,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false, // Obligatorio
    },
    end_date: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('Activo', 'Completado', 'En espera'),
        defaultValue: 'Activo', // Valor predeterminado
    },
}, {
    timestamps: false, // Desactivar createdAt y updatedAt
});


module.exports = Project;
