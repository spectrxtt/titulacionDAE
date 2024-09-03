import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/loginComponent';
import Home from './components/home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CitasProvider } from './components/manejarCitas';
import { FormDataProvider } from './components/formulario_Integracion/integracionDatos'; // Asegúrese de que la ruta sea correcta

function App() {
    return (
        <FormDataProvider>
            <CitasProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginComponent />} />
                        <Route path="/home" element={<Home />} />
                    </Routes>
                </Router>
            </CitasProvider>
        </FormDataProvider>
    );
}

export default App;