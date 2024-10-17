import React, { useState } from 'react';
import ProfileOptions from './profileOptions';
import AlertasYNotificaciones from './AlertasYNotificaciones';
import ResumenDeCitas from './ResumenDeCitas';
import DatosPersonales from './formulario_Integracion/datosPersonales';

import '../styles/home.css';

const Home = () => {
    const [showDatosPersonales, setShowDatosPersonales] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);




    // Cierra las opciones del perfil
    const handleCloseProfileOptions = () => {
        setShowProfileOptions(false);
    };

    // Renderiza los componentes dependiendo del estado
    const renderComponents = () => {
        if (showProfileOptions) {
            return <ProfileOptions onClose={handleCloseProfileOptions} />;
        }

        // Si está en la página principal y no muestra los datos personales
        if (!showDatosPersonales) {
            return (
                <div className="contentRow">
                    <AlertasYNotificaciones />
                    <ResumenDeCitas onVerClick={() => setShowDatosPersonales(true)} />
                </div>
            );
        }

        // Muestra los datos personales si se hace clic en Ver
        return <DatosPersonales />;
    };

    return (
        <div className="appContainer">
            {/* Renderiza el contenido principal basado en el estado */}
            <main className="mainContent">
                {renderComponents()}
            </main>
        </div>
    );
};

export default Home;
