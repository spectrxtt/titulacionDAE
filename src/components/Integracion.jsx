import React, { useState, useEffect } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';

const Integracion = () => {
    const [citas, setCitas] = useState([]); // Estado para almacenar las citas
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para cargar citas
    const [error, setError] = useState(null); // Estado para manejar errores

    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
    };

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const token = localStorage.getItem('token'); // Asume que guardas el token en localStorage
                const response = await fetch('http://10.11.80.237:8000/api/citas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar citas');
                }

                const data = await response.json();

                // Filtrar las citas para excluir los estados "Integrado", "Rechazado" y "Cancelado"
                const citasFiltradas = data.filter(cita =>
                    !['Integrado', 'Rechazado', 'Cancelado'].includes(cita.estado_cita)
                );

                setCitas(citasFiltradas);
            } catch (error) {
                console.error('Error al cargar citas:', error);
                setError(error.message); // Establecer el error en el estado
            } finally {
                setLoading(false); // Cambiar estado de carga
            }
        };

        fetchCitas();
    }, []);

    if (loading) {
        return <div>Cargando citas...</div>; // Mensaje de carga
    }

    if (error) {
        return <div>Error: {error}</div>; // Mensaje de error
    }

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
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Integracion;
