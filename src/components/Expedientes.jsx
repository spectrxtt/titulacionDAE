import React, { useState, useEffect } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';
import Bitacora from './bitacora';

const Expedientes = () => {
    const [citas, setCitas] = useState([]); // Estado para almacenar las citas
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarBitacora, setMostrarBitacora] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState({
        cuenta: '',
        nombre: ''
    });

    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
    };

    const handleBitacoraClick = () => {
        setMostrarBitacora(true);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    };

    const handleBuscar = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.167:8000/api/buscar-citas?cuenta=${busqueda.cuenta}&nombre=${busqueda.nombre}&fecha=${busqueda.fecha}&estado=${busqueda.estado}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al buscar citas');
            }

            const data = await response.json();

            // Eliminar el filtro por estado "Integrado"
            setCitas(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            setError(error.message);
        }
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda({
            cuenta: '',
            nombre: ''
        });
    };

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://10.11.80.167:8000/api/citas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar citas');
                }

                const data = await response.json();

                // Filtrar citas con estado "Integrado" o "Rechazado"
                const citasFiltradas = data.filter(cita =>
                    cita.estado_cita === 'Integrado' || cita.estado_cita === 'Rechazado'|| cita.estado_cita === 'Validado para impresión'
                );

                // Ordenar las citas por fecha (asumiendo que fecha es una cadena ISO)
                const citasOrdenadas = citasFiltradas.sort((a, b) =>
                    new Date(b.fecha) - new Date(a.fecha)
                );

                // Tomar solo las últimas 5 citas
                const ultimasCitas = citasOrdenadas.slice(0, 5);

                setCitas(ultimasCitas);
            } catch (error) {
                console.error('Error al cargar citas:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, []); // Asegúrate de que las dependencias son correctas


    if (loading) {
        return <div>Cargando citas...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
    }

    if (mostrarBitacora) {
        return <Bitacora onClose={() => setMostrarBitacora(false)} />;
    }

    return (
        <div className="integracion-wrapper">
            <div className="buscador">
                {/* Account Number Filter */}
                <input
                    type="text"
                    name="cuenta"
                    value={busqueda.cuenta}
                    onChange={handleBusquedaChange}
                    placeholder="Número de Cuenta"
                />

                {/* Full Name Filter */}
                <input
                    type="text"
                    name="nombre"
                    value={busqueda.nombre}
                    onChange={handleBusquedaChange}
                    placeholder="Nombre Completo"
                />

                {/* Start Date Filter */}
                <input
                    type="date"
                    name="fechaInicio"
                    value={busqueda.fecha || ''}
                    onChange={handleBusquedaChange}
                    placeholder="Fecha de Inicio"
                />

                {/* End Date Filter */}
                <input
                    type="date"
                    name="fechaFinal"
                    value={busqueda.fechaFinal || ''}
                    onChange={handleBusquedaChange}
                    placeholder="Fecha Final"
                />

                {/* Status Filter */}
                <select
                    name="estadoCita"
                    value={busqueda.estadoCita || ''}
                    onChange={handleBusquedaChange}
                >
                    <option value="">Seleccione un estado</option>
                    <option value="Enviado, pendiente de validar">Enviado, pendiente de validar</option>
                    <option value="Integrado">Integrado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Corrección">Corrección</option>
                    <option value="Atendiendo Corrección">Atendiendo Corrección</option>
                    <option value="Corrección Atendida">Corrección Atendida</option>
                </select>

                {/* Search and Clear Buttons */}
                <button onClick={handleBuscar}>Buscar</button>
                <button onClick={handleLimpiarBusqueda}>Limpiar</button>
            </div>

            <div className="containerExpedientes">
                <h3>EXPEDIENTES INTEGRADOS</h3>
                <table className="table">
                    <thead>
                    <tr>
                        <th># Cuenta</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Integrador</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {citas.map((cita, index) => (
                        <tr key={index}>
                            <td>{cita.num_Cuenta || 'N/A'}</td>
                            <td>{cita.nombre || 'N/A'}</td>
                            <td>{cita.fecha || 'N/A'}</td>
                            <td>{cita.estado_cita || 'N/A'}</td>
                            <td>{cita.observaciones || 'N/A'}</td>
                            <td>{cita.id_usuario || 'N/A'}</td>
                            <td>
                                <button className="button" onClick={() => handleVerClick(cita)}>
                                    VER
                                </button>
                                <button className="button" onClick={handleBitacoraClick}>Bitácora</button>
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