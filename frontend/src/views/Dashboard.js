import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './Dashboard.css';

const Dashboard = () => {
    const [projects, setProjects] = useState([]); // Lista de proyectos
    const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado
    const [dashboardData, setDashboardData] = useState(null); // Datos del dashboard

    // Obtener lista de proyectos
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error.response?.data || error.message);
        }
    };

    // Obtener datos del proyecto seleccionado
    const fetchDashboardData = async (projectId) => {
        try {
            const response = await api.get(`/dashboard/${projectId}`);
            setDashboardData(response.data);
        } catch (error) {
            console.error('Error al obtener datos del dashboard:', error.response?.data || error.message);
        }
    };

    // Manejar selección de proyecto
    const handleProjectSelect = (projectId) => {
        setSelectedProject(projectId);
        fetchDashboardData(projectId);
    };

    useEffect(() => {
        fetchProjects(); // Cargar lista de proyectos al inicio
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="title">Dashboard de Proyectos</h1>

            {/* Selección de proyectos */}
            <div className="project-selector">
                <h2 className="subtitle">Selecciona un Proyecto</h2>
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
            </div>

            {/* Mostrar datos del proyecto */}
            {dashboardData && (
                <div className="dashboard-details">
                    {/* Información del Proyecto */}
                    <div className="project-info">
                        <h2 className="section-title">Información del Proyecto</h2>
                        <p><strong>Nombre:</strong> {dashboardData.project.name}</p>
                        <p><strong>Descripción:</strong> {dashboardData.project.description}</p>
                        <p><strong>Fecha de Inicio:</strong> {dashboardData.project.start_date}</p>
                        <p><strong>Fecha de Fin:</strong> {dashboardData.project.end_date}</p>
                        <p><strong>Estado:</strong> {dashboardData.project.status}</p>
                    </div>

                    {/* Hitos */}
                    <div className="project-section">
                        <h2 className="section-title">Hitos</h2>
                        {dashboardData.milestones.length === 0 ? (
                            <p>No hay hitos registrados.</p>
                        ) : (
                            <ul>
                                {dashboardData.milestones.map((milestone) => (
                                    <li key={milestone.id}>
                                        <p><strong>Nombre:</strong> {milestone.name}</p>
                                        <p><strong>Descripción:</strong> {milestone.description}</p>
                                        <p><strong>Fecha de Vencimiento:</strong> {milestone.due_date}</p>
                                        <p><strong>Estado:</strong> {milestone.status}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Recursos */}
                    <div className="project-section">
                        <h2 className="section-title">Recursos</h2>
                        {dashboardData.resources.length === 0 ? (
                            <p>No hay recursos registrados.</p>
                        ) : (
                            <ul>
                                {dashboardData.resources.map((resource) => (
                                    <li key={resource.id}>
                                        <p><strong>Nombre:</strong> {resource.name}</p>
                                        <p><strong>Tipo:</strong> {resource.type}</p>
                                        <p><strong>Email:</strong> {resource.email || 'N/A'}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Planes de Prueba */}
                    <div className="project-section">
                        <h2 className="section-title">Planes de Prueba</h2>
                        {dashboardData.testPlans.length === 0 ? (
                            <p>No hay planes de prueba registrados.</p>
                        ) : (
                            <ul>
                                {dashboardData.testPlans.map((plan) => (
                                    <li key={plan.id}>
                                        <p><strong>Escenario:</strong> {plan.scenario}</p>
                                        <p><strong>Caso de Prueba:</strong> {plan.test_case}</p>
                                        <p><strong>Estado:</strong> {plan.status}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Ejecuciones de Planes de Prueba */}
                    <div className="project-section">
                        <h2 className="section-title">Ejecuciones de Planes</h2>
                        {dashboardData.testExecutions.length === 0 ? (
                            <p>No hay ejecuciones de prueba registradas.</p>
                        ) : (
                            <ul>
                                {dashboardData.testExecutions.map((execution) => (
                                    <li key={execution.id}>
                                        <p><strong>Estado:</strong> {execution.status}</p>
                                        <p><strong>Observaciones:</strong> {execution.observations}</p>
                                        <p><strong>Fecha de Ejecución:</strong> {execution.execution_date}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
