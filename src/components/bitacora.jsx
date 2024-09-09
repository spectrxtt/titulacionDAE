import React from 'react';
import '../styles/bitacora.css';


const Bitacora = ({ cita, onClose }) => {
    const eventos = [
        { fecha: 'AGO 14', hora: '09:15', encargado: 'Gerardo', descripcion: 'Cita rechazada' },
        {fecha: 'AGO 14', hora: '09:10', encargado: 'Gerardo', descripcion: 'Reporte enviado' },
        { fecha: 'AGO 14', hora: '09:00', encargado: 'Gerardo', descripcion: 'Modificacion CURP' },
    ];

    return (
        <div className="bitacora">
            <div className="bitacora-header">
                <h2>Seguimiento de la cita</h2>
                <button onClick={onClose} className="close-button">×</button>
            </div>

            <div className="cita-status">
                <span>Status de la cita: </span>
                <span className="status-badge">RECHAZADO</span>
            </div>

            <div className="eventos-lista">
                {eventos.map((evento, index) => (
                    <div key={index} className="evento">
                        <div className="evento-punto"></div>
                        <div className="evento-contenido">
                            <div className="evento-fecha-hora">
                                <span className="evento-fecha">{evento.fecha}</span>
                                <span className="evento-hora">{evento.hora}</span>
                            </div>
                            <p className="evento-responsable">Responsable: {evento.encargado}</p>
                            <p className="evento-descripcion">{evento.descripcion}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Bitacora;
