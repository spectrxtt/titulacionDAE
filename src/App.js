import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/loginComponent';
import Home from './components/home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CitasProvider } from './components/manejarCitas';  // Asegúrate de que la ruta sea correcta

function App() {
    return (
        <CitasProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginComponent />} />
                    <Route path="/home" element={<Home />} />
                </Routes>
            </Router>
        </CitasProvider>
    );
}

export default App;