import React, { useState } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';  // Asegúrate de que la ruta sea correcta

const Integracion = () => {
    const [citas, setCitas] = useState([
        { id: 1, cuenta: '12345', nombre: 'a', fecha: '1', modalidad: 'Reglamento', estado: 'completo', observaciones: 'Ninguna', ver: 'ver' }
    ]);

    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);

    const handleVerClick = () => {
        setMostrarDatosPersonales(true);
    };

    const handleEstadoChange = (id, newEstado) => {
        setCitas(prevCitas =>
            prevCitas.map(cita =>
                cita.id === id ? { ...cita, estado: newEstado } : cita
            )
        );
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales />;
    }

    return (
        <div className="containerIntegracion">
            <h3>EXPEDIENTES</h3>
            <table className="table">
                <thead>
                <tr>
                    <th># Cuenta</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Modalidad</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                </tr>
                </thead>
                <tbody>
                {citas.map((cita) => (
                    <tr key={cita.id}>
                        <td>{cita.cuenta}</td>
                        <td>{cita.nombre}</td>
                        <td>{cita.fecha}</td>
                        <td>{cita.modalidad}</td>
                        <td>
                            <select
                                value={cita.estado}
                                onChange={(e) => handleEstadoChange(cita.id, e.target.value)}
                                className="dropdown"
                            >
                                <option value="completo">Completo</option>
                                <option value="incompleto">Incompleto</option>
                                <option value="en proceso">En proceso</option>
                                <option value="rechazado">Rechazado</option>
                            </select>
                        </td>
                        <td>{cita.observaciones}</td>
                        <td>
                            <button className="button" onClick={handleVerClick}>{cita.ver}</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Integracion;
