const express = require('express');
const { TestPlan } = require('../associations');
const router = express.Router();

// Obtener pruebas de un proyecto
router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const testPlans = await TestPlan.findAll({ where: { project_id: projectId } });
        res.status(200).json(testPlans);
    } catch (error) {
        console.error('Error al obtener planes de prueba:', error);
        res.status(500).json({ error: 'Error al obtener planes de prueba' });
    }
});

// Crear un nuevo plan de prueba
router.post('/', async (req, res) => {
    try {
        const testPlan = await TestPlan.create(req.body);
        res.status(201).json(testPlan);
    } catch (error) {
        console.error('Error al crear plan de prueba:', error);
        res.status(400).json({ error: 'Error al crear plan de prueba' });
    }
});

// Actualizar un plan de prueba
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await TestPlan.update(req.body, { where: { id } });
        if (updated[0] > 0) {
            const updatedTestPlan = await TestPlan.findByPk(id);
            res.status(200).json(updatedTestPlan);
        } else {
            res.status(404).json({ error: 'Plan de prueba no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar plan de prueba:', error);
        res.status(400).json({ error: 'Error al actualizar plan de prueba' });
    }
});

// Eliminar un plan de prueba
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TestPlan.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Plan de prueba no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar plan de prueba:', error);
        res.status(500).json({ error: 'Error al eliminar plan de prueba' });
    }
});

module.exports = router;
