const express = require('express');
const { Project, Milestone, Resource, TestPlan, TestExecution } = require('../associations');
const router = express.Router();

// Ruta para obtener todos los datos relacionados con un proyecto
router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    console.log(`GET /dashboard/${req.params.projectId}`); // Verifica si la solicitud llega aquí
    try {
        // Obtener el proyecto
        const project = await Project.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Proyecto no encontrado' });
        }

        // Obtener hitos, recursos, planes y ejecuciones relacionados
        const milestones = await Milestone.findAll({ where: { project_id: projectId } });
        const resources = await Resource.findAll({ where: { project_id: projectId } });
        const testPlans = await TestPlan.findAll({ where: { project_id: projectId } });

        // Obtener ejecuciones relacionadas con los planes de prueba
        const testExecutions = await TestExecution.findAll({
            where: {
                testplan_id: testPlans.map(plan => plan.id),
            },
        });

        // Devolver todos los datos en un solo objeto
        res.status(200).json({
            project,
            milestones,
            resources,
            testPlans,
            testExecutions,
        });
    } catch (error) {
        console.error('Error al obtener datos del dashboard:', error);
        res.status(500).json({ error: 'Error al obtener datos del dashboard' });
    }
});

module.exports = router;
