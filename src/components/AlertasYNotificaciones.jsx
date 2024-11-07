import React, { useState, useEffect } from 'react';
import '../styles/citas.css';
import DatosPersonales from "./formulario_Integracion/datosPersonales";

const ResumenDeCitas = ({ onVerClick }) => {
    const [citas, setCitas] = useState([]); // Estado para almacenar las citas
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para cargar citas
    const [error, setError] = useState(null); // Estado para manejar errores

    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
        onVerClick(cita);
    };

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://192.168.137.1:8000/api/citas', {
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

                // Filtrar solo las citas en estado "Corrección"
                const citasCorreccion = data.filter(cita => cita.estado_cita === 'Corrección');

                setCitas(citasCorreccion);
            } catch (error) {
                console.error('Error al cargar citas:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, []);

    if (loading) {
        return <div>Cargando citas...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (citas.length === 0) {
        return (
            <div className="containerCitas">
                <h3>Alertas y Notificaciones</h3>
                <p>No hay citas en estado de corrección.</p>
            </div>
        );
    }

    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
    }

    return (
        <div className="containerCitas">
            <h3>Alertas y Notificaciones</h3>
            <table className="table">
                <thead>
                <tr>
                    <th># Cuenta</th>
                    <th>Nombre</th>
                    <th>Observaciones</th>

                    <th></th>
                </tr>
                </thead>
                <tbody>
                {citas.map((cita, index) => (
                    <tr key={index}>
                        <td>{cita.num_Cuenta}</td>
                        <td>{cita.nombre}</td>
                        <td>{cita.observaciones}</td>

                        <td>
                            <button className="button" onClick={() => handleVerClick(cita)}>VER</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResumenDeCitas;
