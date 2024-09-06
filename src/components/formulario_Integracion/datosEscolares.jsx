import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosPersonales from './datosPersonales';
import Requisitos from './requisitos';
import { useCitas } from '../manejarCitas';
import datosEscolares from '../../pruebas/datosEscolares';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import RequisitosButton from './infoRequisitos';

const DatosEscolares = () => {
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { citas } = useCitas();
    const { formData, updateFormData } = useFormData();

    useEffect(() => {
        if (citas && citas.length > 0) {
            const citaActual = citas[0];
            const numeroCuenta = citaActual['Numero de cuenta'];
            const datoEscolar = datosEscolares.find(d => d.numCuenta === parseInt(numeroCuenta));
            updateFormData({
                ...citaActual,
                ...datoEscolar,
            });
        }
    }, [citas, updateFormData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        updateFormData({ [name]: value });
    };

    const handleVerClickPersonales = () => {
        setMostrarDatosPersonales(true);
    };

    const handleVerClickRequisitos = () => {
        setMostrarDatosRequisitos(true);
    };
    const handleGenerarReporteClick = () => {
        setMostrarGenerarReporte(true);
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales />;
    }

    if (mostrarDatosRequisitos) {
        return <Requisitos />;
    }
    if (mostrarGenerarReporte) {
        return <GenerarReporte />;
    }

    return (
        <div className="personales">
            <div className="boton_generarReporte">
                <button onClick={handleGenerarReporteClick}><i className="fa-solid fa-triangle-exclamation"></i>
                </button>
                <RequisitosButton requisitosContent="Requisitos para Datos Escolares" />
            </div>

            <h2>Datos Escolares</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="bachillerato">Bachillerato procedencia</label>
                    <input
                        type="text"
                        id="bachillerato"
                        name="bachillerato"
                        placeholder="Ej: 12345"
                        value={formData.bachillerato || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fechaInBach">Fecha inicio</label>
                        <input
                            type="date"
                            id="fechaInBach"
                            name="fechaInBach"
                            value={formData.fechaInBach || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinBach">Fecha Finalizacion</label>
                        <input
                            type="date"
                            id="fechaFinBach"
                            name="fechaFinBach"
                            value={formData.fechaFinBach || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="programa">Programa Educativo</label>
                        <input
                            type="text"
                            id="programa"
                            name="programaEducativo"
                            value={formData.programaEducativo || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInLic">Fecha inicio</label>
                        <input
                            type="date"
                            id="fechaInLic"
                            name="fechaInLic"
                            value={formData.fechaInLic || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinLic">Fecha Finalizacion</label>
                        <input
                            type="date"
                            id="fechaFinLic"
                            name="fechaFinLic"
                            value={formData.fechaFinLic || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group-personales">
                    <label htmlFor="pasantia">Estado Pasantia</label>
                    <input
                        type="text"
                        id="pasantia"
                        name="pasantia"
                        placeholder="Ej: 12345"
                        value={formData.pasantia || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modalidad">Modalidad de titulacion</label>
                    <input
                        type="text"
                        id="modalidad"
                        name="modalidad"
                        value={formData.modalidad || ''}
                        onChange={handleInputChange}
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