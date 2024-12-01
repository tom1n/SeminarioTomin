const express = require('express');
const { TestExecution } = require('../associations');
const router = express.Router();

// Obtener todas las ejecuciones de un TestPlan
router.get('/:testplan_id', async (req, res) => {
    try {
        const { testplan_id } = req.params;
        const executions = await TestExecution.findAll({ where: { testplan_id } });
        res.status(200).json(executions);
    } catch (error) {
        console.error('Error al obtener ejecuciones de prueba:', error);
        res.status(500).json({ error: 'Error al obtener ejecuciones de prueba.' });
    }
});

// Crear una nueva ejecución de prueba
router.post('/', async (req, res) => {
    try {
        const { testplan_id, status, observations, execution_date } = req.body;
        if (!testplan_id || !status) {
            return res.status(400).json({ error: 'El ID del plan de prueba y el estado son obligatorios.' });
        }
        const newExecution = await TestExecution.create({
            testplan_id,
            status,
            observations,
            execution_date,
        });
        res.status(201).json(newExecution);
    } catch (error) {
        console.error('Error al crear ejecución de prueba:', error);
        res.status(500).json({ error: 'Error al crear ejecución de prueba.' });
    }
});

// Actualizar una ejecución de prueba
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, observations, execution_date } = req.body;
        const [updated] = await TestExecution.update(
            { status, observations, execution_date },
            { where: { id } }
        );
        if (updated) {
            const updatedExecution = await TestExecution.findOne({ where: { id } });
            res.status(200).json(updatedExecution);
        } else {
            res.status(404).json({ error: 'Ejecución de prueba no encontrada.' });
        }
    } catch (error) {
        console.error('Error al actualizar ejecución de prueba:', error);
        res.status(500).json({ error: 'Error al actualizar ejecución de prueba.' });
    }
});

// Eliminar una ejecución de prueba
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TestExecution.destroy({ where: { id } });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Ejecución de prueba no encontrada.' });
        }
    } catch (error) {
        console.error('Error al eliminar ejecución de prueba:', error);
        res.status(500).json({ error: 'Error al eliminar ejecución de prueba.' });
    }
});

module.exports = router;
