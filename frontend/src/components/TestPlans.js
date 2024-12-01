import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './TestPlans.css';

const TestPlans = () => {
    const [projects, setProjects] = useState([]);
    const [testPlans, setTestPlans] = useState([]);
    const [isTestPlansVisible, setIsTestPlansVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado
    const [newTestPlan, setNewTestPlan] = useState({
        scenario: '',
        test_case: '',
        test_data: '',
        acceptance_criteria: '',
        status: 'Pendiente',
    });
    const [editingTestPlan, setEditingTestPlan] = useState(null); // ID del plan de prueba en edición

    // Leer proyectos
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error.response?.data || error.message);
        }
    };

    // Leer pruebas de un proyecto seleccionado
    const fetchTestPlans = async (projectId) => {
        try {
            const response = await api.get(`/testPlans/${projectId}`);
            setTestPlans(response.data);
        } catch (error) {
            console.error('Error al obtener planes de prueba:', error.response?.data || error.message);
        }
    };

    // Crear o actualizar un plan de prueba
    const saveTestPlan = async () => {
        if (!selectedProject) {
            alert('Debe seleccionar un proyecto antes de guardar un plan de prueba.');
            return;
        }
        try {
            if (editingTestPlan) {
                // Actualizar prueba
                await api.put(`/testPlans/${editingTestPlan}`, {
                    ...newTestPlan,
                    project_id: selectedProject,
                });
                setEditingTestPlan(null);
            } else {
                // Crear prueba
                await api.post('/testPlans', { ...newTestPlan, project_id: selectedProject });
            }
            fetchTestPlans(selectedProject);
            setNewTestPlan({ scenario: '', test_case: '', test_data: '', acceptance_criteria: '', status: 'Pendiente' });
            setSelectedProject(null);
        } catch (error) {
            console.error('Error al guardar plan de prueba:', error);
        }
    };

    // Eliminar un plan de prueba
    const deleteTestPlan = async (testPlanId) => {
        try {
            await api.delete(`/testPlans/${testPlanId}`);
            setTestPlans((prevTestPlans) =>
                prevTestPlans.filter((testPlan) => testPlan.id !== testPlanId)
            );
        } catch (error) {
            console.error('Error al eliminar plan de prueba:', error);
        }
    };

    // Manejar edición de un plan de prueba
    const handleEditTestPlan = (testPlan) => {
        setEditingTestPlan(testPlan.id);
        setNewTestPlan({
            scenario: testPlan.scenario,
            test_case: testPlan.test_case,
            test_data: testPlan.test_data,
            acceptance_criteria: testPlan.acceptance_criteria,
            status: testPlan.status,
        });
    };

    // Manejar selección de proyecto
    const handleProjectSelect = (projectId) => {
        if (selectedProject === projectId && isTestPlansVisible) {
            // Si el proyecto está seleccionado y los planes están visibles, ocúltalos
            setIsTestPlansVisible(false);
        } else {
            // Si no, selecciona el proyecto, carga los planes y muéstralos
            setSelectedProject(projectId);
            fetchTestPlans(projectId);
            setIsTestPlansVisible(true);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="test-plans-container">
            <h1 className="title">Planificación de Pruebas</h1>

            {/* Formulario para crear o editar plan de prueba */}
            <div className="form-container">
                <h2 className="subtitle">{editingTestPlan ? 'Editar Plan de Prueba' : 'Crear Plan de Prueba'}</h2>
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
                    placeholder="Escenario de prueba"
                    value={newTestPlan.scenario}
                    onChange={(e) => setNewTestPlan({ ...newTestPlan, scenario: e.target.value })}
                />
                <textarea
                    className="form-textarea"
                    placeholder="Caso de prueba"
                    value={newTestPlan.test_case}
                    onChange={(e) => setNewTestPlan({ ...newTestPlan, test_case: e.target.value })}
                />
                <textarea
                    className="form-textarea"
                    placeholder="Datos de prueba"
                    value={newTestPlan.test_data}
                    onChange={(e) => setNewTestPlan({ ...newTestPlan, test_data: e.target.value })}
                />
                <textarea
                    className="form-textarea"
                    placeholder="Criterios de aceptación"
                    value={newTestPlan.acceptance_criteria}
                    onChange={(e) => setNewTestPlan({ ...newTestPlan, acceptance_criteria: e.target.value })}
                />
                <select
                    className="form-select"
                    value={newTestPlan.status}
                    onChange={(e) => setNewTestPlan({ ...newTestPlan, status: e.target.value })}
                >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                </select>
                <button className="form-button" onClick={saveTestPlan}>
                    {editingTestPlan ? 'Guardar Cambios' : 'Guardar'}
                </button>
                {editingTestPlan && (
                    <button
                        className="cancel-button"
                        onClick={() => {
                            setEditingTestPlan(null);
                            setNewTestPlan({ scenario: '', test_case: '', test_data: '', acceptance_criteria: '', status: 'Pendiente' });
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>

            {/* Lista de proyectos con planes de prueba */}
            <div className="projects-with-test-plans">
                <h2 className="subtitle">Lista de Proyectos con Planes de Prueba</h2>
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <h3 className="project-title">{project.name}</h3>
                        <p className="project-description">{project.description}</p>
                        <p>Inicio: {project.start_date}</p>
                        <p>Fin: {project.end_date}</p>
                        <button
                            className="view-test-plans-button"
                            onClick={() => handleProjectSelect(project.id)}
                        >
                            {selectedProject === project.id && isTestPlansVisible
                                ? 'Ocultar Planes de Prueba'
                                : 'Ver Planes de Prueba'}
                        </button>

                        {/* Mostrar planes de prueba relacionados al proyecto */}
                        {selectedProject === project.id && isTestPlansVisible && (
                            <div className="test-plans-list">
                                <h4 className="test-plans-title">Planes de Prueba:</h4>
                                {testPlans.length === 0 ? (
                                    <p>No hay planes de prueba para este proyecto.</p>
                                ) : (
                                    testPlans.map((testPlan) => (
                                        <div key={testPlan.id} className="test-plan-card">
                                            <h4><strong>Escenario: </strong> {testPlan.scenario}</h4>
                                            <p><strong>Caso de Prueba:</strong> {testPlan.test_case}</p>
                                            <p><strong>Datos de Prueba:</strong> {testPlan.test_data}</p>
                                            <p><strong>Criterios de Aceptación:</strong> {testPlan.acceptance_criteria}</p>
                                            <p><strong>Estado: </strong>{testPlan.status}</p>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEditTestPlan(testPlan)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => deleteTestPlan(testPlan.id)}
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

export default TestPlans;
