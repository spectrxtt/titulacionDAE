import React, { useState } from 'react';
import '../styles/Integracion.css';

const Reportes = () => {
    const [citas] = useState([
        { id: 1, fecha: '2024-03-01', citasTotales: '10', citasCompletas: '8', citasPendientes: '1', citasCanceladas: '1', observaciones: 'Ninguna' }
    ]);
    const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
    const [filtroFechaFin, setFiltroFechaFin] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('');

    const handleImprimir = () => {
        window.print();
    };

    const aplicarFiltros = () => {
        // Aquí iría la lógica para filtrar las citas según los criterios seleccionados
        console.log("Aplicando filtros:", filtroFechaInicio, filtroFechaFin, filtroTipo);
    };

    return (
        <div className="reportes-wrapper">
            <div className="filtros-container">
                <input
                    type="date"
                    value={filtroFechaInicio}
                    onChange={(e) => setFiltroFechaInicio(e.target.value)}
                    placeholder="Fecha inicio"
                />
                <input
                    type="date"
                    value={filtroFechaFin}
                    onChange={(e) => setFiltroFechaFin(e.target.value)}
                    placeholder="Fecha fin"
                />
                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                >
                    <option value="">Seleccionar período</option>
                    <option value="dia">Día</option>
                    <option value="semana">Semana</option>
                    <option value="mes">Mes</option>
                    <option value="anio">Año</option>
                </select>
                <button onClick={aplicarFiltros}>Aplicar Filtros</button>
            </div>

            <div className="containerReportes">
                <h3>REPORTES</h3>
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

            <button className="imprimir-btn" onClick={handleImprimir}>Imprimir Reporte</button>
        </div>
    );
};

export default Reportes;