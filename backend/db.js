const { Sequelize } = require('sequelize');
require('dotenv').config(); // Para usar variables de entorno

const sequelize = new Sequelize(
    process.env.DB_NAME, // Nombre de la base de datos
    process.env.DB_USER, // Usuario de la base de datos
    process.env.DB_PASSWORD, // Contraseña
    {
        host: process.env.DB_HOST, // Dirección del servidor
        port: process.env.DB_PORT || 3306, // Puerto de MySQL
        dialect: 'mysql',
        logging: true, // Logs de consultas activados para debug
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos exitosa.');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;
