import React, { useState } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import StudentDataPreview from './BorradorPre';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import RequisitosButton from './infoRequisitos';

// Nuevo componente RequisitoField
const RequisitoField = ({ id, label, value, onChange, status, onStatusChange }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div className="input-group">
            <input
                type="text"
                id={id}
                name={id}
                value={value || ''}
                onChange={onChange}
                className="form-control"
            />
            <select
                value={status || ''}
                onChange={onStatusChange}
                className="form-control"
            >
                <option value="">Seleccionar estado</option>
                <option value="completo">Completo</option>
                <option value="incompleto">Incompleto</option>
                <option value="no_aplica">No aplica</option>
            </select>
        </div>
    </div>
);

const Requisitos = ({ citaSeleccionada }) => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const [mostrarDatosborrador, setMostrarDatosborrador] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { formData, updateFormData } = useFormData();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        updateFormData({ [name]: value });
    };

    // Nueva función handleStatusChange
    const handleStatusChange = (name, value) => {
        updateFormData({ [name]: value });
    };

    const handleVerClickEscolares = () => setMostrarDatosEscolares(true);
    const handleVerClickBorrador = () => setMostrarDatosborrador(true);
    const handleGenerarReporteClick = () => setMostrarGenerarReporte(true);

    if (mostrarDatosEscolares) return <DatosEscolares />;
    if (mostrarDatosborrador) return <StudentDataPreview />;
    if (mostrarGenerarReporte) return <GenerarReporte />;

    return (
        <div className="personales">
            <div className="boton_generarReporte">
                <button onClick={handleGenerarReporteClick}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
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
                        <label htmlFor="fechaEgel">Fecha de Aplicación</label>
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
                            type="date"
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
                <div className="form-row">
                    <RequisitoField
                        id="requisito1"
                        label="Requisito 1"
                        value={formData.requisito1}
                        onChange={handleInputChange}
                        status={formData.requisito1Status}
                        onStatusChange={(e) => handleStatusChange('requisito1Status', e.target.value)}
                    />
                    <RequisitoField
                        id="requisito2"
                        label="Requisito 2"
                        value={formData.requisito2}
                        onChange={handleInputChange}
                        status={formData.requisito2Status}
                        onStatusChange={(e) => handleStatusChange('requisito2Status', e.target.value)}
                    />
                </div>
                <div className="form-row">
                    <RequisitoField
                        id="requisito3"
                        label="Requisito 3"
                        value={formData.requisito3}
                        onChange={handleInputChange}
                        status={formData.requisito3Status}
                        onStatusChange={(e) => handleStatusChange('requisito3Status', e.target.value)}
                    />
                    <RequisitoField
                        id="requisito4"
                        label="Requisito 4"
                        value={formData.requisito4}
                        onChange={handleInputChange}
                        status={formData.requisito4Status}
                        onStatusChange={(e) => handleStatusChange('requisito4Status', e.target.value)}
                    />
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClickEscolares}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button onClick={handleVerClickBorrador}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Requisitos;
