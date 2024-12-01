const express = require('express');
const { Milestone } = require('../associations');
const router = express.Router();

// Obtener todos los hitos de un proyecto
router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;

        // Validar que projectId sea un número válido
        if (!projectId || isNaN(projectId)) {
            return res.status(400).json({ error: 'El ID del proyecto no es válido.' });
        }

        // Buscar hitos asociados al proyecto
        const milestones = await Milestone.findAll({ where: { project_id: projectId } });

        if (milestones.length === 0) {
            return res.status(404).json({ error: 'No se encontraron hitos para este proyecto.' });
        }

        const totalMilestones = milestones.length;
        const completedMilestones = milestones.filter((m) => m.status === 'Completado').length;
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

        res.status(200).json(milestones);
    } catch (error) {
        console.error('Error al obtener hitos:', error);
        res.status(500).json({ error: 'Error al obtener hitos.' });
    }
});

// Crear un nuevo hito asociado a un proyecto
router.post('/', async (req, res) => {
    try {
        const { name, description, due_date, status, project_id } = req.body;

        // Validar campos obligatorios
        if (!name || !due_date || !project_id) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }

        // Crear el hito
        const milestone = await Milestone.create({ name, description, due_date, status, project_id });
        res.status(201).json(milestone);
    } catch (error) {
        console.error('Error al crear hito:', error);
        res.status(500).json({ error: 'Error al crear hito.' });
    }
});

// Actualizar un hito
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID sea un número válido
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'El ID del hito no es válido.' });
        }

        const [updated] = await Milestone.update(req.body, { where: { id } });

        if (updated) {
            const updatedMilestone = await Milestone.findOne({ where: { id } });
            res.status(200).json(updatedMilestone);
        } else {
            return res.status(404).json({ error: 'Hito no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar hito:', error);
        res.status(500).json({ error: 'Error al actualizar hito.' });
    }
});

// Eliminar un hito
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Validar que el ID sea un número válido
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: 'El ID del hito no es válido.' });
        }

        const deleted = await Milestone.destroy({ where: { id } });

        if (deleted) {
            res.status(204).send(); // No Content
        } else {
            return res.status(404).json({ error: 'Hito no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar hito:', error);
        res.status(500).json({ error: 'Error al eliminar hito.' });
    }
});

module.exports = router;
