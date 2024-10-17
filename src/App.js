import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginComponent from './components/loginComponent';
import Home from './components/home';
import Citas from './components/Citas';
import Integracion from './components/Integracion';
import Expedientes from './components/Expedientes';
import Reportes from './components/Reportes';
import Configuracion from './components/Configuracion';
import Sidebar from './components/sidebar';
import { CitasProvider } from './components/manejarCitas';
import { FormDataProvider } from './components/formulario_Integracion/integracionDatos';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentComponent, setCurrentComponent] = useState('Inicio');
    const [userRole, setUserRole] = useState(null); // Inicializa como null
    const [userNombre, setUserNombre] = useState(null); // Inicializa como null

    const handleLogin = (user) => {
        setIsAuthenticated(true);
        setUserRole(user.rol); // Asegúrate de que user.rol existe
        setUserNombre(user.nombre_usuario); // Asegúrate de que user.rol existe

    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserRole(null); // Restablece el rol al cerrar sesión
        setUserNombre(null); // Restablece el rol al cerrar sesión
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const handleComponentChange = (component) => {
        setCurrentComponent(component[0]);
    };

    return (
        <FormDataProvider>
            <CitasProvider>
                <Router>
                    {isAuthenticated && (
                        <Sidebar
                            onComponentChange={handleComponentChange}
                            onProfileClick={() => console.log('Perfil')}
                            onLogout={handleLogout}
                            userRole={userRole} // Pasa userRole aquí
                            userNombre={userNombre} // Pasa userRole aquí
                        />
                    )}
                    <Routes>
                        <Route path="/" element={<LoginComponent onLogin={handleLogin} />} />
                        <Route
                            path="/home"
                            element={isAuthenticated ? (
                                <>
                                    {currentComponent === 'Inicio' && <Home onLogout={handleLogout} />}
                                    {currentComponent === 'Citas' && <Citas />}
                                    {currentComponent === 'Integracion' && <Integracion userRole={userRole}/>}
                                    {currentComponent === 'Expedientes' && <Expedientes userRole={userRole}/>}
                                    {currentComponent === 'Reportes' && <Reportes />}
                                    {currentComponent === 'Configuracion' && <Configuracion userRole={userRole} />} {/* Pasamos userRole */}
                                </>
                            ) : <Navigate to="/" />}
                        />
                    </Routes>
                </Router>
            </CitasProvider>
        </FormDataProvider>
    );
}

export default App;
