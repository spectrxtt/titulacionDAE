import React, { useState } from 'react';
import Sidebar from './sidebar';
import AlertasYNotificaciones from './AlertasYNotificaciones';
import ResumenDeCitas from './ResumenDeCitas';
import CargarCitas from './Citas';
import Integracion from './Integracion';
import DatosPersonales from './formulario_Integracion/datosPersonales';
import Configuracion from './Configuracion';
import Expedientes from './Expedientes';
import Reportes from './Reportes';
import CerrarSesion from './CerrarSesion';

import '../styles/home.css';

const Home = () => {
    const [activeComponents, setActiveComponents] = useState(['Inicio']);
    const [showDatosPersonales, setShowDatosPersonales] = useState(false);

    const renderComponents = () => {
        if (activeComponents.includes('Inicio') && !showDatosPersonales) {
            return (
                <div className="contentRow">
                    <AlertasYNotificaciones />
                    <ResumenDeCitas onVerClick={() => setShowDatosPersonales(true)} />
                </div>
            );
        }

        if (showDatosPersonales) {
            return <DatosPersonales />;
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
            <Sidebar onComponentChange={(components) => {
                setActiveComponents(components);
                setShowDatosPersonales(false);
            }} />
            <main className="mainContent">
                {renderComponents()}
            </main>
        </div>
    );
};

export default Home;