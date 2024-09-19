import React from 'react';
import '../styles/citas.css';
import { useCitas } from './manejarCitas';

const ResumenDeCitas = ({ onVerClick }) => {
    const { citas } = useCitas();

    // Función para obtener la fecha de hoy en formato "dd/mm/yyyy"
    const getTodayFormatted = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Filtra las citas para mostrar solo las del día
    const todayFormatted = getTodayFormatted();
    const citasDelDia = citas.filter(cita => cita['Fecha'] === todayFormatted);

    console.log("Fecha de hoy:", todayFormatted);
    console.log("Citas del día:", citasDelDia);
    console.log("Todas las citas:", citas);

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
                        <td>{cita['No.Cuenta']}</td>
                        <td>{cita['Alumno']}</td>
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