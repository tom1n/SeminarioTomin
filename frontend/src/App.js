import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import Projects from './components/Projects';
import Milestones from './components/Milestones';
import Resources from './components/Resources';
import TestPlans from './components/TestPlans';
import TestExecutions from './components/TestExecutions';
import Dashboard from './views/Dashboard';
import './App.css'; // Opcional para estilos globales

const App = () => {
    return (
        <Router>
            <div className="app-container">
                {/* Barra de navegación */}
                <nav className="navbar">
                    <NavLink to="/dashboard" className="nav-link">
                        Dashboard
                    </NavLink>
                    <NavLink to="/projects" className="nav-link">
                        Proyectos
                    </NavLink>
                    <NavLink to="/milestones" className="nav-link">
                        Hitos
                    </NavLink>
                    <NavLink to="/resources" className="nav-link">
                        Recursos
                    </NavLink>
                    <NavLink to="/testplans" className="nav-link">
                        Planes
                    </NavLink>
                    <NavLink to="/testexecutions" className="nav-link">
                        Pruebas
                    </NavLink>
                </nav>

                {/* Contenido dinámico */}
                <div className="content">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/milestones" element={<Milestones />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/testplans" element={<TestPlans />} /> 
                        <Route path="/testexecutions" element={<TestExecutions />} /> 
                        <Route path="*" element={<Dashboard />} /> {/* Ruta por defecto */}
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
