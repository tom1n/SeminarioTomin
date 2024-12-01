const express = require('express');
const { Project, Milestone } = require('../associations');
const router = express.Router();

// Obtener todos los proyectos
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects || []); // Responde con un array vacío si no hay proyectos
    } catch (error) {
        console.error('Error al obtener proyectos:', error);
        res.status(500).json({ error: 'Error al obtener proyectos' });
    }
});

// Crear un proyecto
router.post('/', async (req, res) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear proyecto' });
    }
});

// Actualizar un proyecto
router.put('/:id', async (req, res) => {
    try {
        const project = await Project.update(req.body, { where: { id: req.params.id } });
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar proyecto' });
    }
});

// Eliminar un proyecto
router.delete('/:id', async (req, res) => {
    try {
        await Project.destroy({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar proyecto' });
    }
});

module.exports = router;
