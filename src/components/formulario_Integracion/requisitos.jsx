import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import StudentDataPreview from './BorradorPre';
import { useCitas } from '../manejarCitas';
import requisitos from '../../pruebas/requisitos';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import RequisitosButton from './infoRequisitos';

const Requisitos = () => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const [mostrarDatosborrador, setMostrarDatosborrador] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { citas } = useCitas();
    const { formData, updateFormData } = useFormData();

    useEffect(() => {
        if (citas && citas.length > 0) {
            const citaActual = citas[0];
            const numeroCuenta = citaActual['Numero de cuenta'];
            const datoRequisito = requisitos.find(d => d.numCuenta === parseInt(numeroCuenta));

            updateFormData({
                ...citaActual,
                ...datoRequisito
            });
        }
    }, [citas, updateFormData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        updateFormData({ [name]: value });
    };
    const handleVerClickEscolares = () => {
        setMostrarDatosEscolares(true);
    };

    const handleVerClickBorrador = () => {
        setMostrarDatosborrador(true);
    };
    const handleGenerarReporteClick = () => {
        setMostrarGenerarReporte(true);
    };

    if (mostrarDatosEscolares) {
        return <DatosEscolares />;
    }

    if (mostrarDatosborrador) {
        return <StudentDataPreview />;
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
            <h2>Requisitos</h2>
            <div className="form-container-personales">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="egel">Resultado EGEL</label>
                        <input
                            type="text"
                            id="egel"
                            name="Egel"
                            value={formData.Egel || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaEgel">Fecha de Aplicacion</label>
                        <input
                            type="date"
                            id="fechaEgel"
                            name="fechaEgel"
                            value={formData.fechaEgel || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="servicioSocial">Servicio Social</label>
                        <input
                            type="text"
                            id="servicioSocial"
                            name="servicioSocial"
                            value={formData.servicioSocial || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="practicasProfesionales">Prácticas Profesionales</label>
                        <input
                            type="text"
                            id="practicasProfesionales"
                            name="practicasProfesionales"
                            value={formData.practicasProfesionales || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="examenIngles">Examen de Inglés</label>
                        <input
                            type="text"
                            id="examenIngles"
                            name="examenIngles"
                            value={formData.examenIngles || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInLic">Fecha Aplicación</label>
                        <input
                            type="date"
                            id="fechaInLic"
                            name="fechaInLic"
                            value={formData.fechaInLic || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="biblioteca">Biblioteca</label>
                        <input
                            type="text"
                            id="biblioteca"
                            name="Biblioteca"
                            value={formData.Biblioteca || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cedai">CEDAI</label>
                        <input
                            type="text"
                            id="cedai"
                            name="cedai"
                            value={formData.cedai || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="laboratorio">Laboratorio</label>
                        <input
                            type="text"
                            id="laboratorio"
                            name="Laboratorio"
                            value={formData.Laboratorio || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClickEscolares}><i className="fa-solid fa-arrow-left"></i></button>
                    <button onClick={handleVerClickBorrador}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    );
}


export default Requisitos;
