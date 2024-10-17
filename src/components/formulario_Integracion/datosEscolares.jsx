import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosPersonales from './datosPersonales';
import Requisitos from './requisitos';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import RequisitosButton from './infoRequisitos';

const DatosEscolares = ({ citaSeleccionada }) => {
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { formData, updateFormData } = useFormData();
    const [estudianteBachData, setEstudianteBachData] = useState(null);
    const [estudianteUniData, setEstudianteUniData] = useState(null);

    useEffect(() => {
        const fetchDatosEscolares = async () => {
            if (!citaSeleccionada || !citaSeleccionada.num_Cuenta) {
                console.log('No hay número de cuenta disponible');
                return;
            }

            const token = localStorage.getItem('token');

            // Obtener datos de Bachillerato
            try {
                const bachResponse = await fetch(`http://127.0.0.1:8000/api/estudiantes/bachillerato/${citaSeleccionada.num_Cuenta}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (bachResponse.ok) {
                    const bachData = await bachResponse.json();
                    setEstudianteBachData(bachData);
                    updateFormData({ ...formData, ...bachData });
                } else {
                    throw new Error('Error al obtener datos de Bachillerato');
                }
            } catch (error) {
                console.error('Error en Bachillerato:', error);
            }

            // Obtener datos de Universidad
            try {
                const uniResponse = await fetch(`http://127.0.0.1:8000/api/estudiantes/uni/${citaSeleccionada.num_Cuenta}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (uniResponse.ok) {
                    const uniData = await uniResponse.json();
                    setEstudianteUniData(uniData);
                    updateFormData({ ...formData, ...uniData });
                } else {
                    throw new Error('Error al obtener datos de Universidad');
                }
            } catch (error) {
                console.error('Error en Universidad:', error);
            }
        };

        fetchDatosEscolares();
    }, [citaSeleccionada, updateFormData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        updateFormData({ ...formData, [name]: value });
    };

    const handleVerClickPersonales = (e) => {
        e.preventDefault();
        setMostrarDatosPersonales(true);
    };

    const handleVerClickRequisitos = (e) => {
        e.preventDefault();
        setMostrarDatosRequisitos(true);
    };

    const handleGenerarReporteClick = (e) => {
        e.preventDefault();
        setMostrarGenerarReporte(true);
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
    }

    if (mostrarDatosRequisitos) {
        return <Requisitos citaSeleccionada={citaSeleccionada} />;
    }

    if (mostrarGenerarReporte) {
        return <GenerarReporte citaSeleccionada={citaSeleccionada} />;
    }

    return (
        <div className="personales">
            <div className="boton_generarReporte">
                <button onClick={handleGenerarReporteClick}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </button>
                <RequisitosButton requisitosContent="Requisitos para licenciatura en derecho: " />
            </div>

            <h2>Datos Escolares</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="bachillerato">Bachillerato procedencia</label>
                    <input
                        type="text"
                        id="bachillerato"
                        name="bachillerato"
                        value={formData.id_bach || ''}
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
                            value={formData.fecha_inicio_bach || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinBach">Fecha Finalización</label>
                        <input
                            type="date"
                            id="fechaFinBach"
                            name="fechaFinBach"
                            value={formData.fecha_fin_bach || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Datos de Universidad */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="programa">Programa Educativo</label>
                        <input
                            type="text"
                            id="programa"
                            name="programaEducativo"
                            value={formData.id_programa_educativo || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInLic">Fecha inicio</label>
                        <input
                            type="date"
                            id="fechaInLic"
                            name="fechaInLic"
                            value={formData.fecha_inicio_uni || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinLic">Fecha Finalización</label>
                        <input
                            type="date"
                            id="fechaFinLic"
                            name="fechaFinLic"
                            value={formData.fecha_fin_uni || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="form-group-personales">
                    <label htmlFor="pasantia">Periodo de pasantía</label>
                    <input
                        type="text"
                        id="pasantia"
                        name="pasantia"
                        value={formData.periodo_pasantia|| ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modalidad">Modalidad de titulación</label>
                    <input
                        type="text"
                        id="modalidad"
                        name="modalidad"
                        value={formData.id_modalidad || ''}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="boton_integracionS">
                    <button onClick={handleVerClickPersonales}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button onClick={handleVerClickRequisitos}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatosEscolares;
