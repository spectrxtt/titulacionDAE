import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosPersonales from './datosPersonales';
import Requisitos from './requisitos';
import { useCitas } from '../manejarCitas';
import datosEscolares from '../../pruebas/datosEscolares';

const DatosEscolares = () => {
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const [datosActuales, setDatosActuales] = useState({});
    const { citas } = useCitas();

    useEffect(() => {
        if (citas && citas.length > 0) {
            const citaActual = citas[0]; // Asumimos que queremos mostrar la primera cita
            const numeroCuenta = citaActual['Numero de cuenta'];

            // Buscar datos adicionales en datosEscolares
            const datoEscolar = datosEscolares.find(d => d.numCuenta === parseInt(numeroCuenta));

            setDatosActuales({
                ...citaActual,
                ...datoEscolar
            });
        }
    }, [citas]);

    const handleVerClickPersonales = () => {
        setMostrarDatosPersonales(true);
    };

    const handleVerClickRequisitos = () => {
        setMostrarDatosRequisitos(true);
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales />;
    }

    if (mostrarDatosRequisitos) {
        return <Requisitos />;
    }

    return (
        <div className="personales">
            <h2>Datos Escolares</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="bachillerato">Bachillerato procedencia</label>
                    <input type="text" id="bachillerato" name="bachillerato" placeholder="Ej: 12345"/>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fechaInBach">Fecha inicio</label>
                        <input type="date" id="fechaInBach" name="fechaInBach"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinBach">Fecha Finalizacion</label>
                        <input type="date" id="fechaFinBach" name="fechaFinBach"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="programa">Programa Educativo</label>
                        <input
                            type="text"
                            id="programa"
                            name="programa"
                            value={datosActuales.programaEducativo || ''}
                            onChange={(e) => setDatosActuales({ ...datosActuales, programaEducativo: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaInLic">Fecha inicio</label>
                            <input type="date" id="fechaInLic" name="fechaInLic"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaFinLic">Fecha Finalizacion</label>
                            <input type="date" id="fechaFinLic" name="fechaFinLic"/>
                        </div>
                    </div>
                </div>
                <div className="form-group-personales">
                    <label htmlFor="pasantia">Estado Pasantia</label>
                    <input type="text" id="pasantia" name="pasantia" placeholder="Ej: 12345"/>
                </div>
                <div className="form-group">
                    <label htmlFor="modalidad">Modalidad de titulacion</label>
                    <input
                        type="text"
                        id="modalidad"
                        name="modalidad"
                        value={datosActuales.modalidad || ''}
                        onChange={(e) => setDatosActuales({ ...datosActuales, modalidad: e.target.value })}
                    />
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClickPersonales}><i className="fa-solid fa-arrow-left"></i></button>
                    <button onClick={handleVerClickRequisitos}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    );
}

export default DatosEscolares;
