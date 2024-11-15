import React, { useState, useEffect } from 'react';
import '../styles/citas.css';
import DatosPersonales from "./formulario_Integracion/datosPersonales";

const ResumenDeCitas = ({ onVerClick }) => {
    const [citas, setCitas] = useState([]); // Estado para almacenar las citas
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para cargar citas
    const [error, setError] = useState(null); // Estado para manejar errores

    const formatDateS = (fecha) => {
        if (!fecha) return 'N/A';
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) return 'N/A';

        // Ajustar la fecha para compensar la diferencia de zona horaria
        const offsetMs = fechaObj.getTimezoneOffset() * 60 * 1000;
        const adjustedDate = new Date(fechaObj.getTime() + offsetMs);

        const dia = adjustedDate.getDate().toString().padStart(2, '0');
        const mes = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
        const año = adjustedDate.getFullYear();
        return `${dia}-${mes}-${año}`;
    };
    // Función para obtener la fecha de hoy en formato "yyyy-mm-dd"
    const getTodayFormatted = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
        onVerClick(cita); // Pasa la cita seleccionada a onVerClick
    };



    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://10.11.80.188:8000/api/citas', {
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

                // Filtrar citas del día que estén en estado "Pendiente"
                const todayFormatted = getTodayFormatted();
                const citasHoyPendientes = data.filter(
                    cita => cita.fecha === todayFormatted && cita.estado_cita === 'pendiente'
                );

                setCitas(citasHoyPendientes);
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
        return <div>Cargando citas del día...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (citas.length === 0) {
        return (
            <div className="containerCitas">
                <h3>RESUMEN DE CITAS DEL DÍA</h3>
                <p>No hay citas pendientes para hoy.</p>
            </div>
        );
    }
    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
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
                {citas.map((cita, index) => (
                    <tr key={index}>
                        <td>{cita.num_Cuenta}</td>
                        <td>{cita.nombre}</td>
                        <td>{formatDateS(cita.fecha)}</td>
                        <td>{cita.estado_cita}</td>
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
