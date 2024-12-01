import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './Projects.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
    });
    const [editing, setEditing] = useState(null); // ID del proyecto que se está editando

    // Leer proyectos
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error.response?.data || error.message);
        }
    };

    // Crear un proyecto
    const createProject = async () => {
        try {
            await api.post('/projects', newProject);
            fetchProjects();
            setNewProject({ name: '', description: '', start_date: '', end_date: '' }); // Limpiar formulario
        } catch (error) {
            console.error('Error al crear proyecto:', error);
        }
    };

    // Editar un proyecto
    const editProject = async (id) => {
        try {
            await api.put(`/projects/${id}`, newProject);
            fetchProjects();
            setEditing(null); // Salir del modo de edición
            setNewProject({ name: '', description: '', start_date: '', end_date: '' }); // Limpiar formulario
        } catch (error) {
            console.error('Error al editar proyecto:', error);
        }
    };

    // Eliminar un proyecto
    const deleteProject = async (id) => {
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
        }
    };

    // Manejar datos para edición
    const handleEdit = (project) => {
        setEditing(project.id);
        setNewProject({
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
        });
    };

    // Actualizar los proyectos al cargar el componente
    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="projects-container">
            <h1 className="title">Gestión de Proyectos</h1>

            {/* Formulario para crear o editar proyecto */}
            <div className="form-container">
                <h2 className="subtitle">{editing ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
                <input
                    className="form-input"
                    type="text"
                    placeholder="Nombre"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
                <textarea
                    className="form-textarea"
                    placeholder="Descripción"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={3}
                />
                <input
                    className="form-input"
                    type="date"
                    placeholder="Fecha de inicio"
                    value={newProject.start_date}
                    onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                />
                <input
                    className="form-input"
                    type="date"
                    placeholder="Fecha de finalización"
                    value={newProject.end_date}
                    onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                />
                <button
                    className="form-button"
                    onClick={editing ? () => editProject(editing) : createProject}
                >
                    {editing ? 'Guardar Cambios' : 'Crear'}
                </button>
                {editing && (
                    <button
                        className="cancel-button"
                        onClick={() => {
                            setEditing(null);
                            setNewProject({ name: '', description: '', start_date: '', end_date: '' });
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* Lista de proyectos */}
            <div className="projects-list">
                <h2 className="subtitle">Proyectos</h2>
                {projects.map((project) => (
                    <div className="project-card" key={project.id}>
                        <h3 className="project-title">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <p className="project-dates">Inicio: {project.start_date}</p>
                        <p className="project-dates">Fin: {project.end_date}</p>
                        <button
                            className="edit-button"
                            onClick={() => handleEdit(project)}
                        >
                            Editar
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => deleteProject(project.id)}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
