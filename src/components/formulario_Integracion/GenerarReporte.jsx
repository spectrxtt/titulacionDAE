import React, { useState } from 'react';
import Integracion from '../Integracion';
import { useCitas } from '../manejarCitas';

const GenerarReporte = () => {
    const [estadoCita, setEstadoCita] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const { citas, actualizarCitas } = useCitas();
    const [mostrarIntegracion, setMostrarIntegracion] = useState(false);

    if (mostrarIntegracion) {
        return <Integracion />;
    }

    const handleGuardar = () => {
        const newCitas = [...citas];
        newCitas[0] = {
            ...newCitas[0],
            Estado: estadoCita,
            Observaciones: observaciones,
        };
        actualizarCitas(newCitas);
        setMostrarIntegracion(true);
    };

    return (
        <div className="generar-reporte">
            <h2>Generar Reporte</h2>
            <div className="form-container-reporte">
                <div className="form-group">
                    <label htmlFor="estadoCita">Estado de la Cita</label>
                    <select
                        id="estadoCita"
                        value={estadoCita}
                        onChange={(e) => setEstadoCita(e.target.value)}
                    >
                        <option value="">Seleccione un estado</option>
                        <option value="Completo">Completo</option>
                        <option value="Rechazado">Rechazado</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="En revisión">En revisión</option>
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
                    <button onClick={handleGuardar}>Guardar Reporte</button>
                </div>
            </div>
        </div>
    );
};

export default GenerarReporte;
