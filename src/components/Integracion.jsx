import React, { useState } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';
import DatosEscolares from './formulario_Integracion/datosEscolares';
import { useCitas } from './manejarCitas';

const Integracion = () => {
    const { citas, actualizarCitas } = useCitas();
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);

    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
    };

    const handleEstadoChange = (index, newEstado) => {
        const newCitas = [...citas];
        newCitas[index] = { ...newCitas[index], Estado: newEstado };
        actualizarCitas(newCitas);
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
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
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {citas.map((cita, index) => (
                    <tr key={index}>
                        <td>{cita['No.Cuenta']}</td>
                        <td>{cita['Alumno']}</td>
                        <td>{cita['Fecha']}</td>
                        <td>{cita['Estado'] || 'Pendiente'}</td>
                        <td>{cita['Observaciones']}</td>
                        <td>
                            <button
                                className="button"
                                onClick={() => handleVerClick(cita)}
                            >
                                VER
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Integracion;
