import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './Milestones.css';

const Milestones = () => {
    const [projects, setProjects] = useState([]);
    const [milestones, setMilestones] = useState([]);
    const [isMilestonesVisible, setIsMilestonesVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [newMilestone, setNewMilestone] = useState({
        name: '',
        description: '',
        due_date: '',
        status: 'Pendiente',
    });
    const [editingMilestone, setEditingMilestone] = useState(null); // ID del hito en edición

    // Leer proyectos
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error.response?.data || error.message);
        }
    };

    // Leer hitos de un proyecto seleccionado
    const fetchMilestones = async (projectId) => {
        try {
            const response = await api.get(`/milestones/${projectId}`);
            setMilestones(response.data);
        } catch (error) {
            console.error('Error al obtener hitos:', error.response?.data || error.message);
        }
    };

    // Calcular el porcentaje de progreso
    const calculateProgress = (milestones) => {
        if (!milestones || milestones.length === 0) return 0;
        const completed = milestones.filter((milestone) => milestone.status === 'Completo').length;
        return Math.round((completed / milestones.length) * 100);
    };

    // Crear o actualizar un hito
    const saveMilestone = async () => {
        if (!selectedProject) {
            alert('Debe seleccionar un proyecto antes de guardar un hito.');
            return;
        }
        try {
            if (editingMilestone) {
                // Actualizar hito
                await api.put(`/milestones/${editingMilestone}`, {
                    ...newMilestone,
                    project_id: selectedProject,
                });
                setEditingMilestone(null);
            } else {
                // Crear hito
                await api.post('/milestones', { ...newMilestone, project_id: selectedProject });
            }
            fetchMilestones(selectedProject);
            setNewMilestone({ name: '', description: '', due_date: '', status: 'Pendiente' });
        } catch (error) {
            console.error('Error al guardar hito:', error);
        }
    };

    // Eliminar un hito
    const deleteMilestone = async (milestoneId) => {
        try {
            await api.delete(`/milestones/${milestoneId}`);
            fetchMilestones(selectedProject);
        } catch (error) {
            console.error('Error al eliminar hito:', error.response?.data || error.message);
        }
    };

    // Manejar edición de un hito
    const handleEditMilestone = (milestone) => {
        setEditingMilestone(milestone.id);
        setNewMilestone({
            name: milestone.name,
            description: milestone.description,
            due_date: milestone.due_date,
            status: milestone.status,
        });
    };

    // Manejar selección de proyecto
    const handleProjectSelect = (projectId) => {
        if (selectedProject === projectId && isMilestonesVisible) {
            // Si el proyecto está seleccionado y los hitos están visibles, ocúltalos
            setIsMilestonesVisible(false);
        } else {
            // Si no, selecciona el proyecto, carga los hitos y muéstralos
            setSelectedProject(projectId);
            fetchMilestones(projectId);
            setIsMilestonesVisible(true);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="milestones-container">
            <h1 className="title">Gestión de Hitos</h1>

            {/* Formulario para crear o editar hito */}
            <div className="form-container">
                <h2 className="subtitle">{editingMilestone ? 'Editar Hito' : 'Crear Hito'}</h2>
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
                    placeholder="Nombre del Hito"
                    value={newMilestone.name}
                    onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                />
                <textarea
                    className="form-textarea"
                    placeholder="Descripción del Hito"
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                    rows={3}
                />
                <input
                    className="form-input"
                    type="date"
                    value={newMilestone.due_date}
                    onChange={(e) => setNewMilestone({ ...newMilestone, due_date: e.target.value })}
                />
                <select
                    className="form-select"
                    value={newMilestone.status}
                    onChange={(e) => setNewMilestone({ ...newMilestone, status: e.target.value })}
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Completo">Completo</option>
                </select>
                <button className="form-button" onClick={saveMilestone}>
                    {editingMilestone ? 'Guardar Cambios' : 'Guardar'}
                </button>
                {editingMilestone && (
                    <button
                        className="cancel-button"
                        onClick={() => {
                            setEditingMilestone(null);
                            setNewMilestone({ name: '', description: '', due_date: '', status: 'Pendiente' });
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* Lista de proyectos con hitos */}
            <div className="projects-with-milestones">
                <h2 className="subtitle">Lista de Proyectos con Hitos</h2>
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <h3 className="project-title">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <p>Inicio: {project.start_date}</p>
                        <p>Fin: {project.end_date}</p>
                        <button
                            className="view-milestones-button"
                            onClick={() => handleProjectSelect(project.id)}
>
                            {selectedProject === project.id && isMilestonesVisible
                                ? 'Ocultar Hitos'
                                : 'Ver Hitos'}
                        </button>

                        {/* Mostrar hitos relacionados al proyecto */}
                        {selectedProject === project.id && isMilestonesVisible && (
                            <div className="milestones-list">
                                <h4 className="milestones-title">Hitos:</h4>
                                <div className="progress-text">
                                <p><strong>Progreso:</strong> {calculateProgress(milestones)}%</p>
                                </div>
                                {milestones.length === 0 ? (
                                    <p>No hay hitos para este proyecto.</p>
                                ) : (
                                    milestones.map((milestone) => (
                                        <div key={milestone.id} className="milestone-card">
                                            <h4>{milestone.name}</h4>
                                            <p>{milestone.description}</p>
                                            <p>Fecha Límite: {milestone.due_date}</p>
                                            <p>Estado: {milestone.status}</p>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEditMilestone(milestone)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => deleteMilestone(milestone.id)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Milestones;
