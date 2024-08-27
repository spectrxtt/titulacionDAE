import React, { useState } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosPersonales from './datosPersonales';
import Requisitos from './requisitos';

const DatosEscolares = () => {
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);

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
                        <input type="date" id="fechaInBach" name="fechaInBach" placeholder="Ej: María"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinBach">Fecha Finalizacion</label>
                        <input type="date" id="fechaFinBach" name="fechaFinBach" placeholder="Ej: García"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="programa">Programa Educativo</label>
                        <select id="programa" name="programa">
                            <option value="">Seleccione el Programa Educativo</option>
                            <option>Licenciatura en Arquitectura</option>
                            <option>Licenciatura en Derecho</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaInLic">Fecha inicio</label>
                            <input type="date" id="fechaInLic" name="fechaInLic" placeholder="Ej: María"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaFinLic">Fecha Finalizacion</label>
                            <input type="date" id="fechaFinLic" name="fechaFinLic" placeholder="Ej: García"/>
                        </div>
                    </div>
                </div>
                <div className="form-group-personales">
                    <label htmlFor="pasantia">Estado Pasantia</label>
                    <input type="text" id="pasantia" name="pasantia" placeholder="Ej: 12345"/>
                </div>
                <div className="form-group">
                    <label htmlFor="modalidad">Modalidad de titulacion</label>
                    <select id="modalidad" name="modalidad">
                        <option value="">Seleccione el Programa Educativo</option>
                        <option>Reglamento</option>
                        <option>EGEL</option>
                    </select>
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClickPersonales} ><i className="fa-solid fa-arrow-left"></i></button>
                    <button onClick={handleVerClickRequisitos}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    );
}

export default DatosEscolares;
