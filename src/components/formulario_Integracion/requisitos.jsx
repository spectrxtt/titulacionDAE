import React, { useState } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import DatosPersonales from './datosPersonales';

const Requisitos = () => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);

    const handleVerClickEscolares = () => {
        setMostrarDatosEscolares(true);
    };

    const handleVerClickRequisitos = () => {
        setMostrarDatosRequisitos(true);
    };

    if (mostrarDatosEscolares) {
        return <DatosEscolares />;
    }

    if (mostrarDatosRequisitos) {
        return <DatosPersonales />;
    }


    return (
        <div className="personales">
            <h2>Datos Escolares</h2>
            <div className="form-container-personales">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="egel">Resultado EGEL</label>
                        <select id="egel" name="egel">
                            <option value="">Seleccione el resultado</option>
                            <option>Satisfactorio</option>
                            <option>Sobresaliente</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaEgel">Fecha de Aplicacion</label>
                            <input type="date" id="fechaEgel" name="fechaEgel" placeholder="Ej: María"/>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="servicioSocial">Servicio Social</label>
                        <select id="servicioSocial" name="servicioSocial">
                            <option value="">Servicio Social</option>
                            <option>En certificado</option>
                            <option>Sobresaliente</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="practicasProfesionales">Practicas Profesionales</label>
                        <select id="practicasProfesionales" name="practicasProfesionales">
                            <option value="">Practicas Profecionales</option>
                            <option>En certificado</option>
                            <option>Sobresaliente</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="programa">Examen de Ingles</label>
                        <select id="programa" name="programa">
                            <option value="">Seleccione el Resultado</option>
                            <option>B1</option>
                            <option>B2</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="fechaInLic">Fecha Aplicacion</label>
                            <input type="date" id="fechaInLic" name="fechaInLic" placeholder="Ej: María"/>
                        </div>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="biblioteca">Biblioteca</label>
                        <select id="biblioteca" name="biblioteca">
                            <option value="">Seleccione el estado del requsito</option>
                            <option>Completado</option>
                            <option>No Aplica</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="cedai">CEDAI</label>
                            <select id="cedai" name="cedai">
                                <option value="">Seleccione el estado del requsito</option>
                                <option>Completado</option>
                                <option>No Aplica</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-group">
                            <label htmlFor="laboratorio">Laboratorio</label>
                            <select id="laboratorio" name="laboratorio">
                                <option value="">Seleccione el estado del requsito</option>
                                <option>Completado</option>
                                <option>No Aplica</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClickEscolares}><i className="fa-solid fa-arrow-left"></i></button>
                    <button onClick={handleVerClickRequisitos}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    );
}

export default Requisitos;
