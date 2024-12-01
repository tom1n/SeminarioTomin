const express = require('express');
const { Resource } = require('../associations');
const router = express.Router();

// Obtener todos los recursos de un proyecto
router.get('/:projectId', async (req, res) => {
    try {
        const { projectId } = req.params;
        const resources = await Resource.findAll({ where: { project_id: projectId } });
        if (!resources.length) {
            return res.status(404).json({ error: 'No se encontraron recursos para este proyecto.' });
        }
        res.status(200).json(resources);
    } catch (error) {
        console.error('Error al obtener recursos:', error);
        res.status(500).json({ error: 'Error al obtener recursos' });
    }
});

// Crear un recurso
router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos en el backend:', req.body); // Log para depuración
        const resource = await Resource.create(req.body);
        res.status(201).json(resource);
    } catch (error) {
        console.error('Error al crear recurso:', error);
        res.status(400).json({ error: 'Error al crear recurso' });
    }
});




// Actualizar un recurso
router.put('/:id', async (req, res) => {
    try {
        const resource = await Resource.update(req.body, { where: { id: req.params.id } });
        res.json(resource);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar recurso' });
    }
});

// Eliminar un recurso
router.delete('/:id', async (req, res) => {
    try {
        await Resource.destroy({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar recurso' });
    }
});

module.exports = router;
