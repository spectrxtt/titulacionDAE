import React, { useState } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';

const Expedientes = () => {
    const [citas, setCitas] = useState([
        { id: 1, cuenta: '12345', nombre: 'Juan', apellidoPaterno: 'Pérez', apellidoMaterno: 'García', fecha: '2024-03-01', modalidad: 'Reglamento', estado: 'completo', observaciones: 'Ninguna', ver: 'ver' }
    ]);

    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [busqueda, setBusqueda] = useState({
        cuenta: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: ''
    });

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

    const handleBusquedaChange = (e) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    };

    const handleBuscar = () => {
        // Aquí iría la lógica para filtrar las citas según los criterios de búsqueda
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

    if (mostrarDatosPersonales) {
        return <DatosPersonales />;
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
                        <th>Estado</th>
                        <th>Observaciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {citas.map((cita) => (
                        <tr key={cita.id}>
                            <td>{cita.cuenta}</td>
                            <td>{`${cita.nombre} ${cita.apellidoPaterno} ${cita.apellidoMaterno}`}</td>
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
        </div>
    );
};

export default Expedientes;