import React, { useState } from 'react';
import Sidebar from './sidebar';
import AlertasYNotificaciones from './AlertasYNotificaciones';
import ResumenDeCitas from './ResumenDeCitas';
import CargarCitas from './Citas';
import Integracion from './Integracion';
import Configuracion from './Configuracion';
import Expedientes from './Expedientes';
import Reportes from './Reportes';
import CerrarSesion from './CerrarSesion';

import '../styles/home.css';

const Home = () => {
    const [activeComponents, setActiveComponents] = useState(['Inicio']);

    const renderComponents = () => {
        if (activeComponents.includes('Inicio')) {
            return (
                <div className="contentRow">
                    <AlertasYNotificaciones />
                    <ResumenDeCitas />
                </div>
            );
        }

        return activeComponents.map(component => {
            switch (component) {
                case 'Citas':
                    return <CargarCitas key="Citas" />;
                case 'Integracion':
                    return <Integracion key="Integracion" />;
                case 'Configuracion':
                    return <Configuracion key="Configuracion" />;
                case 'Expedientes':
                    return <Expedientes key="Expedientes" />;
                case 'Reportes':
                    return <Reportes key="Reportes" />;
                case 'CerrarSesion':
                    return <CerrarSesion key="CerrarSesion" />;
                default:
                    return null;
            }
        });
    };

    return (
        <div className="appContainer">
            <Sidebar onComponentChange={setActiveComponents} />
            <div className="mainContent">
                {renderComponents()}
            </div>
        </div>
    );
};

export default Home;