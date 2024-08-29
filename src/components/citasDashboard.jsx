import React, { useState } from 'react';
import Integracion from './Integracion';
import ResumenDeCitas from './ResumenDeCitas';
import citas from '../citas';  // Asegúrate de la ruta correcta

const CitasDashboard = () => {
    const [citasData, setCitasData] = useState(citas);
    const [verDatosPersonales, setVerDatosPersonales] = useState(false);

    const handleVerClick = () => {
        setVerDatosPersonales(true);
    };

    return (
        <div>
            {verDatosPersonales ? (
                <Integracion citas={citasData} />
            ) : (
                <ResumenDeCitas onVerClick={handleVerClick} citas={citasData} />
            )}
        </div>
    );
};

export default CitasDashboard;
