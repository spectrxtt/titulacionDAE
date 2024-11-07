import React, { useState } from 'react';
import ProfileOptions from './profileOptions';
import AlertasYNotificaciones from './AlertasYNotificaciones';
import ResumenDeCitas from './ResumenDeCitas';
import DatosPersonales from './formulario_Integracion/datosPersonales';

import '../styles/home.css';

const Home = () => {
    const [showDatosPersonales, setShowDatosPersonales] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null); // Nuevo estado para almacenar la cita seleccionada

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
                    <AlertasYNotificaciones
                        onVerClick={(cita) => {
                            setCitaSeleccionada(cita); // Guarda la cita seleccionada
                            setShowDatosPersonales(true); // Muestra los datos personales
                        }}
                    />
                    <ResumenDeCitas
                        onVerClick={(cita) => {
                            setCitaSeleccionada(cita); // Guarda la cita seleccionada
                            setShowDatosPersonales(true); // Muestra los datos personales
                        }}
                    />
                </div>
            );
        }

        // Muestra los datos personales si se hace clic en Ver
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />; // Pasa la cita seleccionada
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
