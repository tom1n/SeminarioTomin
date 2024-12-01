const Project = require('./models/Project'); 
const Resource = require('./models/Resource');
const Milestone = require('./models/Milestone');
const TestPlan = require('./models/TestPlan');
const TestExecution = require('./models/TestExecution');

// Relaciones Proyectos -> Recursos
Project.hasMany(Resource, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Resource.belongsTo(Project, { foreignKey: 'project_id' });

// Relaciones Proyectos -> Hitos
Project.hasMany(Milestone, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Milestone.belongsTo(Project, { foreignKey: 'project_id' });

// Relaciones Proyectos -> Planes de Prueba
Project.hasMany(TestPlan, { foreignKey: 'project_id', onDelete: 'CASCADE' });
TestPlan.belongsTo(Project, { foreignKey: 'project_id' });

// Relación entre TestPlan y TestExecution
TestPlan.hasMany(TestExecution, { foreignKey: 'testplan_id', onDelete: 'CASCADE' });
TestExecution.belongsTo(TestPlan, { foreignKey: 'testplan_id' });

module.exports = { Project, Resource, Milestone, TestPlan, TestExecution };
