const express = require('express');
const appRoutes = require('./routes/app'); // Importa el centralizador de rutas
const sequelize = require('./db'); // Conexión a la base de datos
require('dotenv').config(); // Cargar variables de entorno
const cors = require('cors'); // Importa el paquete
const { Project, TestPlan, TestExecution } = require('./associations');
const app = express();

// Middleware para procesar JSON
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las solicitudes

// Integrar rutas de la API
app.use('/api', appRoutes);

// Sincronizar base de datos y levantar servidor
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida.');


        // Sincroniza las tablas
        await sequelize.sync({ alter: true });
        console.log('Base de datos sincronizada.');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

startServer();
