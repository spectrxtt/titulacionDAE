import React, { useState, useCallback } from 'react';
import Integracion from '../Integracion';

// Define los estados de la cita con una propiedad `updateDate` para controlar la actualización de la fecha
const ESTADOS_CITA = [
    { value: 'Integrado', label: 'Integrado', updateDate: true },
    { value: 'pendiente', label: 'pendiente', updateDate: false },
    { value: 'Enviado, pendiente de validar', label: 'Enviado, pendiente de validar', updateDate: false },
    { value: 'Dato Faltante', label: 'Dato Faltante', updateDate: false },
    { value: 'Rechazado', label: 'Rechazado', updateDate: false },
    { value: 'Corrección', label: 'Corrección', updateDate: false },
    { value: 'Atendiendo Corrección', label: 'Atendiendo Corrección', updateDate: false },
    { value: 'Corrección Atendida', label: 'Corrección Atendida', updateDate: false },
    { value: 'Correccion Aprobada', label: 'Correccion Aprobada', updateDate: false }, // No actualiza la fecha
];

const GenerarReporte = ({ citaSeleccionada }) => {
    const [estadoCita, setEstadoCita] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mostrarIntegracion, setMostrarIntegracion] = useState(false);

    const handleEstadoChange = (event) => {
        setEstadoCita(event.target.value);
    };

    const handleActualizarEstadoCita = useCallback(async () => {
        if (!citaSeleccionada) {
            console.error('No hay cita seleccionada');
            return; // Salir si no hay cita
        }

        const token = localStorage.getItem('token');
        const currentDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        const estadoSeleccionado = ESTADOS_CITA.find(estado => estado.value === estadoCita && estado.label === document.getElementById("estadoCita").selectedOptions[0].text);

        // Construye los datos a enviar, enviando "Integrado" si la opción seleccionada es "Correccion Aprobada"
        const requestData = {
            estado_cita: estadoSeleccionado?.value === 'Correccion Aprobada' ? 'Integrado' : estadoCita,
            observaciones: observaciones || 'Ninguna',
            ...(estadoSeleccionado?.updateDate && { fecha: currentDate }), // Agrega la fecha solo si updateDate es true
        };

        try {
            const response = await fetch(`http://10.11.80.111:8000/api/actualizar-estado-cita-fecha/${citaSeleccionada.id_cita}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la cita');
            }

            const result = await response.json();
            console.log(result.message);

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
                            <option key={estado.label} value={estado.value}>
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
