import React, { useState } from 'react';
import '../styles/Integracion.css';
import StudentDataPreview from './formulario_Integracion/BorradorPre';
import { useCitas } from './manejarCitas';
import Bitacora from './bitacora';

const Expedientes = () => {
    const { citas, actualizarCitas } = useCitas();
    const [mostrarPreview, setMostrarPreview] = useState(false);
    const [mostrarBitacora, setMostrarBitacora] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [busqueda, setBusqueda] = useState({
        cuenta: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: ''
    });

    const handleVerClick = () => {
        setMostrarPreview(true);
    };

    const handleBitacoraClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarBitacora(true);
    };

    const handleEstadoChange = (id, newEstado) => {
        const newCitas = citas.map(cita =>
            cita.id === id ? { ...cita, estado: newEstado } : cita
        );
        actualizarCitas(newCitas);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    };

    const handleBuscar = () => {
        console.log("Realizando búsqueda con:", busqueda);
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda({
            cuenta: '',
            nombre: '',
            apellidoPaterno: '',
            apellidoMaterno: ''
        });
    };

    if (mostrarPreview) {
        return <StudentDataPreview />;
    }

    if (mostrarBitacora) {
        return <Bitacora cita={citaSeleccionada} onClose={() => setMostrarBitacora(false)} />;
    }

    return (
        <div className="integracion-wrapper">
            <div className="buscador">
                <input
                    type="text"
                    name="cuenta"
                    value={busqueda.cuenta}
                    onChange={handleBusquedaChange}
                    placeholder="Número de Cuenta"
                />
                <input
                    type="text"
                    name="nombre"
                    value={busqueda.nombre}
                    onChange={handleBusquedaChange}
                    placeholder="Nombre"
                />
                <input
                    type="text"
                    name="apellidoPaterno"
                    value={busqueda.apellidoPaterno}
                    onChange={handleBusquedaChange}
                    placeholder="Apellido Paterno"
                />
                <input
                    type="text"
                    name="apellidoMaterno"
                    value={busqueda.apellidoMaterno}
                    onChange={handleBusquedaChange}
                    placeholder="Apellido Materno"
                />

                <button onClick={handleBuscar}>Buscar</button>
                <button onClick={handleLimpiarBusqueda}>Limpiar</button>
            </div>

            <div className="containerExpedientes">
                <h3>EXPEDIENTES</h3>
                <table className="table">
                    <thead>
                    <tr>
                        <th># Cuenta</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Modalidad</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {citas.map((cita) => (
                            <tr key={cita.index}>
                                <td>{cita['Numero de cuenta']}</td>

                                <td>{cita['Fecha']}</td>
                                <td>{cita['Modalidad']}</td>
                                <td>{cita['Tipo']}</td>
                                <td>{cita['Estado'] || 'Pendiente'}</td>
                                <td>{cita['Observaciones']}</td>
                                <td>
                                    <select
                                        value={cita.estado || 'completo'}
                                        onChange={(e) => handleEstadoChange(cita.id, e.target.value)}
                                        className="dropdown"
                                    >
                                        <option value="completo">Integrado</option>
                                        <option value="incompleto">Incompleto</option>
                                        <option value="en proceso">En proceso</option>
                                        <option value="rechazado">Rechazado</option>
                                    </select>
                                </td>
                                <td>{cita.observaciones || 'No disponible'}</td>
                                <td>
                                    <button className="button" onClick={handleVerClick}>Integrar</button>
                                    <button className="button" onClick={() => handleBitacoraClick(cita)}>Bitácora
                                    </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                </table>
            </div>
        </div>
    );
};

export default Expedientes;