import React, { useState, useEffect } from 'react';
import api from '../axiosConfig';
import './TestExecutions.css';

const TestExecutions = () => {
    const [projects, setProjects] = useState([]);
    const [testPlans, setTestPlans] = useState([]);
    const [testExecutions, setTestExecutions] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedTestPlan, setSelectedTestPlan] = useState(null);
    const [isExecutionsVisible, setIsExecutionsVisible] = useState(false);
    const [newTestExecution, setNewTestExecution] = useState({
        status: 'Éxito',
        observations: '',
        execution_date: '',
    });
    const [editingExecution, setEditingExecution] = useState(null);

    // Buscar proyectos
    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error.response?.data || error.message);
        }
    };

    // Buscar planes
    const fetchTestPlans = async (projectId) => {
        try {
            const response = await api.get(`/testplans/${projectId}`);
            setTestPlans(response.data);
        } catch (error) {
            console.error('Error fetching test plans:', error.response?.data || error.message);
        }
    };

    // Buscar ejecuciones de un plan
    const fetchTestExecutions = async (testPlanId) => {
        try {
            const response = await api.get(`/testexecutions/${testPlanId}`);
            setTestExecutions(response.data);
        } catch (error) {
            console.error('Error fetching test executions:', error.response?.data || error.message);
        }
    };

    // Crear o actualizar una ejecucion
    const saveTestExecution = async () => {
        if (!selectedTestPlan) {
            alert('Debe seleccionar un plan de prueba antes de guardar una ejecución.');
            return;
        }
        try {
            const executionData = {
                ...newTestExecution,
                testplan_id: selectedTestPlan,
            };
    
            // Si execution_date está vacío, elimina el campo para permitir el valor por defecto
            if (!executionData.execution_date) {
                delete executionData.execution_date;
            }
    
            if (editingExecution) {
                await api.put(`/testexecutions/${editingExecution}`, executionData);
                setEditingExecution(null);
            } else {
                await api.post('/testexecutions', executionData);
            }
    
            fetchTestExecutions(selectedTestPlan);
    
            // Limpia el formulario después de guardar
            setNewTestExecution({ status: 'Éxito', observations: '', execution_date: '' });
            setSelectedProject(null);
            setSelectedTestPlan(null);
        } catch (error) {
            console.error('Error al guardar ejecución de prueba:', error);
        }
    };
    

    // Borrrar una ejecucion
    const deleteTestExecution = async (executionId) => {
        try {
            await api.delete(`/testexecutions/${executionId}`);
            setTestExecutions((prevExecutions) =>
                prevExecutions.filter((execution) => execution.id !== executionId)
            );
        } catch (error) {
            console.error('Error deleting test execution:', error);
        }
    };

    // Manejar Editar Ejecucion
    const handleEditExecution = (execution) => {
        setEditingExecution(execution.id);
        setNewTestExecution({
            status: execution.status,
            observations: execution.observations,
            execution_date: execution.execution_date,
        });
    };

    // Cambiar visibilidad del boton Mostrar Ejecuciones
    const toggleExecutionsVisibility = (testPlanId) => {
        if (selectedTestPlan === testPlanId && isExecutionsVisible) {
            setIsExecutionsVisible(false);
        } else {
            setSelectedTestPlan(testPlanId);
            fetchTestExecutions(testPlanId);
            setIsExecutionsVisible(true);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div className="test-executions-container">
            <h1 className="title">Ejecución de Pruebas</h1>

            {/* Form */}
            <div className="form-container">
                <h2 className="subtitle">{editingExecution ? 'Editar Ejecución' : 'Nueva Ejecución'}</h2>
                <select
                    className="form-select"
                    value={selectedProject || ''}
                    onChange={(e) => {
                        setSelectedProject(e.target.value);
                        fetchTestPlans(e.target.value);
                    }}
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
                <select
                    className="form-select"
                    value={selectedTestPlan || ''}
                    onChange={(e) => setSelectedTestPlan(e.target.value)}
                >
                    <option value="" disabled>
                        Seleccionar Plan de Prueba
                    </option>
                    {testPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                            {plan.scenario}
                        </option>
                    ))}
                </select>
                <select
                    className="form-select"
                    value={newTestExecution.status}
                    onChange={(e) =>
                        setNewTestExecution({ ...newTestExecution, status: e.target.value })
                    }
                >
                    <option value="Éxito">Éxito</option>
                    <option value="Falla">Falla</option>
                </select>
                <textarea
                    className="form-textarea"
                    placeholder="Observaciones"
                    value={newTestExecution.observations}
                    onChange={(e) =>
                        setNewTestExecution({ ...newTestExecution, observations: e.target.value })
                    }
                />
                <input
                    className="form-input"
                    type="date"
                    value={newTestExecution.execution_date}
                    onChange={(e) =>
                        setNewTestExecution({ ...newTestExecution, execution_date: e.target.value })
                    }
                />
                <button className="form-button" onClick={saveTestExecution}>
                    {editingExecution ? 'Guardar Cambios' : 'Guardar'}
                </button>
                {editingExecution && (
                    <button
                        className="cancel-button"
                        onClick={() => {
                            setEditingExecution(null);
                            setNewTestExecution({ status: 'Éxito', observations: '', execution_date: '' });
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </div>

                    {/* Proyectos y Planes de Prueba */}
                    <div className="projects-with-test-executions">
                        <h2 className="subtitle">Lista de Proyectos con Planes de Prueba</h2>
                        {projects.map((project) => (
                            <div key={project.id} className="project-card">
                                <h3 className="project-title">{project.name}</h3>
                                <p className="project-description">{project.description}</p>

                                {/* Mostrar planes de prueba relacionados al proyecto */}
                                {testPlans
                                    .filter((plan) => plan.project_id === project.id) // Filtrar planes por proyecto
                                    .map((plan) => (
                                        <div key={plan.id} className="plan-card">
                                            <h4 className="plan-title">{plan.scenario}</h4>
                                            <button
                                                className="toggle-executions-button"
                                                onClick={() => toggleExecutionsVisibility(plan.id)}
                                            >
                                                {selectedTestPlan === plan.id && isExecutionsVisible
                                                    ? 'Ocultar Ejecuciones'
                                                    : 'Ver Ejecuciones'}
                                            </button>
                                            {/* Mostrar ejecuciones relacionadas al plan */}
                                            {selectedTestPlan === plan.id && isExecutionsVisible && (
                                                <div className="test-executions-list">
                                                    <h4 className="executions-title">Ejecuciones:</h4>
                                                    {testExecutions
                                                        .filter((execution) => execution.testplan_id === plan.id) // Filtrar por plan
                                                        .map((execution) => (
                                                            <div key={execution.id} className="execution-card">
                                                                <p>Estado: {execution.status}</p>
                                                                <p>Observaciones: {execution.observations}</p>
                                                                <p>Fecha de Ejecución: {execution.execution_date}</p>
                                                                <button
                                                                    className="edit-button"
                                                                    onClick={() => handleEditExecution(execution)}
                                                                >
                                                                    Editar
                                                                </button>
                                                                <button
                                                                    className="delete-button"
                                                                    onClick={() => deleteTestExecution(execution.id)}
                                                                >
                                                                    Eliminar
                                                                </button>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        ))}
                    </div>

        </div>
    );
};

export default TestExecutions;
