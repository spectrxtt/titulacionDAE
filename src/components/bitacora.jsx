import React from 'react';

const Bitacora = ({ cita, onClose }) => {

    return (
        <div className="bitacora">
            <h2>Bitácora de Cambios</h2>
            <h3>Expediente: {cita.cuenta}</h3>
            <h4>Nombre: {`${cita.nombre} ${cita.apellidoPaterno} ${cita.apellidoMaterno}`}</h4>

            <ul>
                <li>Cambio 1...</li>
                <li>Cambio 2...</li>
                {/* ... */}
            </ul>

            <button onClick={onClose}>Cerrar Bitácora</button>
        </div>
    );
};

export default Bitacora;