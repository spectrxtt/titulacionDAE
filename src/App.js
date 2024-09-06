import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/loginComponent';
import Home from './components/home';
import Citas from './components/Citas';
import Integracion from './components/Integracion';
import Expedientes from './components/Expedientes';
import Reportes from './components/Reportes';
import Configuracion from './components/Configuracion';
import { CitasProvider } from './components/manejarCitas';
import { FormDataProvider } from './components/formulario_Integracion/integracionDatos';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    return (
        <FormDataProvider>
            <CitasProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<LoginComponent />} />
                        <Route path="/home" element={<Home />}>
                            <Route path="citas" element={<Citas />} />
                            <Route path="integracion" element={<Integracion />} />
                            <Route path="expedientes" element={<Expedientes />} />
                            <Route path="reportes" element={<Reportes />} />
                            <Route path="configuracion" element={<Configuracion />} />
                        </Route>
                    </Routes>
                </Router>
            </CitasProvider>
        </FormDataProvider>
    );
}

export default App;