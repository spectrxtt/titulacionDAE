import React, { useState, useCallback } from 'react';
import Integracion from '../Integracion';

// Define los estados de la cita
const ESTADOS_CITA = [
    { value: 'Integrado', label: 'Integrado' },
    { value: 'Rechazado', label: 'Rechazado' },
    { value: 'Corrección', label: 'Corrección' },
    { value: 'Atendiendo Corrección', label: 'Atendiendo Corrección' },
    { value: 'Corrección Atendida', label: 'Corrección Atendida' },

];

const GenerarReporte = ({ citaSeleccionada }) => {
    const [estadoCita, setEstadoCita] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mostrarIntegracion, setMostrarIntegracion] = useState(false);

    // Maneja el cambio en el estado de la cita
    const handleEstadoChange = (event) => {
        setEstadoCita(event.target.value);
    };

    const handleActualizarEstadoCita = useCallback(async () => {
        if (!citaSeleccionada) {
            console.error('No hay cita seleccionada');
            return; // Salir si no hay cita
        }

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://10.11.80.188:8000/api/actualizar-estado-cita/${citaSeleccionada.id_cita}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ estado_cita: estadoCita, observaciones: observaciones || 'Ninguna' }), // Envía 'Ninguna' si el campo está vacío
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la cita');
            }

            const result = await response.json();
            console.log(result.message);

            // Cambia el estado para mostrar el componente Integracion
            setMostrarIntegracion(true);

        } catch (error) {
            console.error('Error:', error);
        }
    }, [citaSeleccionada, estadoCita, observaciones]);

    const handleGuardar = () => {
        handleActualizarEstadoCita(); // Llama a la función que actualiza la cita
    };

    if (mostrarIntegracion) {
        return <Integracion />;
    }

    return (
        <div className="generar-reporte">
            <h2>Generar Reporte</h2>
            <div className="form-container-reporte">
                <div className="form-group">
                    <label htmlFor="estadoCita">Estado de la Cita</label>
                    <select
                        id="estadoCita"
                        value={estadoCita}
                        onChange={handleEstadoChange}
                    >
                        <option value="">Seleccione un estado</option>
                        {ESTADOS_CITA.map((estado) => (
                            <option key={estado.value} value={estado.value}>
                                {estado.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="observaciones">Observaciones</label>
                    <textarea
                        id="observaciones"
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows="4"
                    ></textarea>
                </div>
                <div className="boton_guardarReporte">
                    <button onClick={handleGuardar} disabled={!estadoCita}>
                        Guardar Reporte
                    </button>
                </div>
                {!citaSeleccionada && <p>No hay citas disponibles para actualizar.</p>}
            </div>
        </div>
    );
};

export default GenerarReporte;