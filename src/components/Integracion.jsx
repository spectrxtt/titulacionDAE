import React, { useState } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';
import { useCitas } from './manejarCitas';

const Integracion = () => {
    const { citas, actualizarCitas } = useCitas();
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);

    const handleVerClick = () => {
        setMostrarDatosPersonales(true);
    };

    const handleEstadoChange = (index, newEstado) => {
        const newCitas = [...citas];
        newCitas[index] = { ...newCitas[index], Estado: newEstado };
        actualizarCitas(newCitas);
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales />;
    }

    return (
        <div className="containerIntegracion">
            <h3>CITAS DEL DÍA</h3>
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
                {citas.map((cita, index) => (
                    <tr key={index}>
                        <td>{cita['Numero de cuenta']}</td>
                        <td>{`${cita['Nombre']} ${cita['Apellido Paterno']} ${cita['Apellido Materno']}`.trim()}</td>
                        <td>{cita['Fecha']}</td>
                        <td>{cita['Modalidad']}</td>
                        <td>
                            <select
                                value={cita['Estado'] || 'Pendiente'}
                                onChange={(e) => handleEstadoChange(index, e.target.value)}
                                className="dropdown"
                            >
                                <option value="Pendiente">Pendiente</option>
                                <option value="Completo">Completo</option>
                                <option value="Incompleto">Incompleto</option>
                                <option value="En proceso">En proceso</option>
                                <option value="Rechazado">Rechazado</option>
                            </select>
                        </td>
                        <td>{cita['Observaciones']}</td>
                        <td>
                            <button className="button" onClick={handleVerClick}>VER</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Integracion;