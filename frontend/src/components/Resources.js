import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './Resources.css';

const Resources = () => {
    const [projects, setProjects] = useState([]);
    const [resources, setResources] = useState([]);
    const [isResourcesVisible, setIsResourcesVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado
    const [newResource, setNewResource] = useState({
        name: '',
        type: 'Persona',
        email: '',
    });
    const [editingResource, setEditingResource] = useState(null); // ID del recurso en edición

    // Leer proyectos
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error.response?.data || error.message);
        }
    };

    // Leer recursos de un proyecto seleccionado
    const fetchResources = async (projectId) => {
        try {
            console.log('Project ID enviado al backend:', projectId); // Log para depuración
            const response = await api.get(`/resources/${projectId}`);
            setResources(response.data);
        } catch (error) {
            console.error('Error al obtener recursos:', error.response?.data || error.message);
        }
    };

    // Crear o actualizar un recurso
    const saveResource = async () => {
        if (!selectedProject) {
            alert('Debe seleccionar un proyecto antes de guardar un recurso.');
            return;
        }
        try {
            const resourceData = { ...newResource, project_id: selectedProject };
            if (!resourceData.email) {
                delete resourceData.email; // Elimina el campo si está vacío
            }
    
            if (editingResource) {
                await api.put(`/resources/${editingResource}`, resourceData);
                setEditingResource(null);
            } else {
                await api.post('/resources', resourceData);
            }
            fetchResources(selectedProject);
            setNewResource({ name: '', type: 'Persona', email: '' });
        } catch (error) {
            console.error('Error al guardar recurso:', error);
        }
    };
    

    // Eliminar un recurso
    const deleteResource = async (resourceId) => {
        try {
            await api.delete(`/resources/${resourceId}`);
            setResources((prevResources) =>
                prevResources.filter((resource) => resource.id !== resourceId)
            );
        } catch (error) {
            console.error('Error al eliminar recurso:', error);
        }
    };

    // Manejar edición de un recurso
    const handleEditResource = (resource) => {
        setEditingResource(resource.id);
        setNewResource({
            name: resource.name,
            type: resource.type,
            email: resource.email,
        });
    };

    // Manejar selección de proyecto
    const handleProjectSelect = (projectId) => {
        if (selectedProject === projectId && isResourcesVisible) {
            // Si el proyecto está seleccionado y los planes están visibles, ocúltalos
            setIsResourcesVisible(false);
        } else {
            // Si no, selecciona el proyecto, carga los planes y muéstralos
            setSelectedProject(projectId);
            fetchResources(projectId);
            setIsResourcesVisible(true);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="resources-container">
            <h1 className="title">Gestión de Recursos</h1>

            {/* Formulario para crear o editar recurso */}
            <div className="form-container">
                <h2 className="subtitle">{editingResource ? 'Editar Recurso' : 'Crear Recurso'}</h2>
                <select
                    className="form-select"
                    value={selectedProject || ''}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                >
                    <option value="" disabled>
                        Seleccionar Proyecto
                    </option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                            {project.name}
                        </option>
                    ))}
                </select>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Nombre del Recurso"
                    value={newResource.name}
                    onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                />
                <select
                    className="form-select"
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                >
                    <option value="Persona">Persona</option>
                    <option value="Herramienta">Herramienta</option>
                </select>
                <input
                    className="form-input"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={newResource.email}
                    onChange={(e) => setNewResource({ ...newResource, email: e.target.value })}
                />
                <button className="form-button" onClick={saveResource}>
                    {editingResource ? 'Guardar Cambios' : 'Guardar'}
                </button>
                {editingResource && (
                    <button
                        className="cancel-button"
                        onClick={() => {
                            setEditingResource(null);
                            setNewResource({ name: '', type: 'Persona', email: '' });
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* Lista de proyectos con recursos */}
            <div className="projects-with-resources">
                <h2 className="subtitle">Lista de Proyectos con Recursos</h2>
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <h3 className="project-title">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <p>Inicio: {project.start_date}</p>
                        <p>Fin: {project.end_date}</p>
                        <button
                            className="view-resources-button"
                            onClick={() => handleProjectSelect(project.id)}
                        >
                            {selectedProject === project.id && isResourcesVisible
                                ? 'Ocultar Recursos'
                                : 'Ver Recursos'}
                        </button>

                        {/* Mostrar recursos relacionados al proyecto */}
{selectedProject === project.id && isResourcesVisible && (
    <div className="resources-list">
        <h4 className="resources-title">Recursos:</h4>
        {resources
            .filter((resource) => resource.project_id === project.id) // Filtrar por project_id
            .map((resource) => (
                <div key={resource.id} className="resource-card">
                    <h4>{resource.name}</h4>
                    <p>Tipo: {resource.type}</p>
                    {resource.email && <p>Correo: {resource.email}</p>} {/* Mostrar solo si hay email */}
                    <button
                        className="edit-button"
                        onClick={() => handleEditResource(resource)}
                    >
                        Editar
                    </button>
                    <button
                        className="delete-button"
                        onClick={() => deleteResource(resource.id)}
                    >
                        Eliminar
                    </button>
                </div>
            ))}
        {resources.filter((resource) => resource.project_id === project.id).length === 0 && (
            <p>No hay recursos para este proyecto.</p>
        )}
    </div>
)}

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;
