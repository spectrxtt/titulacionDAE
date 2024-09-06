import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import ProfileOptions from './profileOptions';
import AlertasYNotificaciones from './AlertasYNotificaciones';
import ResumenDeCitas from './ResumenDeCitas';
import CargarCitas from './Citas';
import Integracion from './Integracion';
import DatosPersonales from './formulario_Integracion/datosPersonales';
import Configuracion from './Configuracion';
import Expedientes from './Expedientes';
import Reportes from './Reportes';

import '../styles/home.css';

const Home = () => {
    const [activeComponents, setActiveComponents] = useState(['Inicio']);
    const [showDatosPersonales, setShowDatosPersonales] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setShowProfileOptions(true);
    };

    const handleCloseProfileOptions = () => {
        setShowProfileOptions(false);
    };

    const renderComponents = () => {
        if (showProfileOptions) {
            return <ProfileOptions onClose={handleCloseProfileOptions} />;
        }

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
                    navigate('/');
                    return null;
                default:
                    return null;
            }
        });
    };

    return (
        <div className="appContainer">
            {activeComponents.includes('CerrarSesion') ? null : (
                <Sidebar
                    onComponentChange={(components) => {
                        setActiveComponents(components);
                        setShowDatosPersonales(false);
                        setShowProfileOptions(false);
                    }}
                    onProfileClick={handleProfileClick}
                />
            )}
            <main className="mainContent">
                {renderComponents()}
            </main>
        </div>
    );
};

export default Home;