const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Resource = sequelize.define('Resource', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // Obligatorio
    },
    type: {
        type: DataTypes.ENUM('Persona', 'Herramienta'),
        allowNull: false, // Obligatorio
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: {
                msg: 'El correo electrónico debe ser válido',
            },
        },
        defaultValue: null, // Asegura que el valor predeterminado sea null
    },
    
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false, // Obligatorio
        references: {
            model: 'projects', // Nombre de la tabla de referencia
            key: 'id',
        },
    },
}, {
    timestamps: false, // Deshabilita createdAt y updatedAt
});

module.exports = Resource;
