import React from 'react';
import '../styles/citas.css';
import citas from '../pruebas/citas';  // Asegúrate de ajustar la ruta según tu estructura de carpetas

const ResumenDeCitas = ({ onVerClick }) => {
    // Filtra las citas para mostrar solo las del día
    const today = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
    const citasDelDia = citas.filter(cita => cita.fecha === today);

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
                {citasDelDia.map((cita) => (
                    <tr key={cita.id}>
                        <td>{cita.cuenta}</td>
                        <td>{cita.nombre}</td>
                        <td>{cita.fecha}</td>
                        <td>{cita.estado}</td>
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
