const express = require('express');
const projectRoutes = require('./projectRoutes');
const resourceRoutes = require('./resourceRoutes');
const milestoneRoutes = require('./milestoneRoutes');
const testRoutes = require('./testRoutes');
const testExecutionRoutes = require('./testExecutionRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const app = express();

// Rutas base para cada recurso
app.use('/projects', projectRoutes);
app.use('/resources', resourceRoutes);
app.use('/milestones', milestoneRoutes);
app.use('/testplans', testRoutes); 
app.use('/testexecutions', testExecutionRoutes);
app.use('/dashboard', dashboardRoutes);



module.exports = app;
