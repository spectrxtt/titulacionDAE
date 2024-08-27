import React, { useState } from 'react';
import '../styles/Integracion.css';

const Reportes = () => {
    const [citas] = useState([
        { id: 1, fecha: '12345', citasTotales: '10', citasCompletas: '8',citasPendientes:'1',citasCanceladas:'1', observaciones: 'Ninguna' }
    ]);

    return (
        <div className="containerIntegracion">
            <h3>CITAS DEL DÍA</h3>
            <table className="table">
                <thead>
                <tr>
                    <th>Fecha</th>
                    <th>Citas Totales</th>
                    <th>Citas Completadas</th>
                    <th>Citas Pendientes</th>
                    <th>Citas canceladas</th>
                    <th>Observaciones</th>
                </tr>
                </thead>
                <tbody>
                {citas.map((cita) => (
                    <tr key={cita.id}>
                        <td>{cita.fecha}</td>
                        <td>{cita.citasTotales}</td>
                        <td>{cita.citasCompletas}</td>
                        <td>{cita.citasPendientes}</td>
                        <td>{cita.citasCanceladas}</td>
                        <td>{cita.observaciones}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reportes;
