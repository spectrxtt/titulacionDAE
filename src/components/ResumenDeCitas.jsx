import React from 'react';
import '../styles/citas.css';
import { useCitas } from './manejarCitas';

const ResumenDeCitas = ({ onVerClick }) => {
    const { citas } = useCitas();

    // Filtra las citas para mostrar solo las del día
    const today = new Date().toISOString().split('T')[0];
    const citasDelDia = citas.filter(cita => cita['Fecha'] === today);

    if (citasDelDia.length === 0) {
        return (
            <div className="containerCitas">
                <h3>RESUMEN DE CITAS DEL DÍA</h3>
                <p>No hay citas programadas para hoy.</p>
            </div>
        );
    }

    return (
        <div className="containerCitas">
            <h3>RESUMEN DE CITAS DEL DÍA</h3>
            <table className="table">
                <thead>
                <tr>
                    <th># Cuenta</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {citasDelDia.map((cita, index) => (
                    <tr key={index}>
                        <td>{cita['Numero de cuenta']}</td>
                        <td>{`${cita['Nombre']} ${cita['Apellido Paterno']} ${cita['Apellido Materno']}`.trim()}</td>
                        <td>{cita['Fecha']}</td>
                        <td>{cita['Estado'] || 'Pendiente'}</td>
                        <td>
                            <button className="button" onClick={() => onVerClick(cita)}>VER</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResumenDeCitas;