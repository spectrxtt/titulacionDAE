import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import StudentDataPreview from './BorradorPre';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import RequisitosButton from './infoRequisitos';
import ClipLoader from "react-spinners/ClipLoader";

const Requisitos = ({ citaSeleccionada }) => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const [mostrarDatosborrador, setMostrarDatosborrador] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { formData, updateFormData } = useFormData();
    const [loading, setLoading] = useState(true);
    const dataFetchedRef = useRef(false);
    const [requisitosPrograma, setRequisitosPrograma] = useState([]); // Estado para los requisitos dinámicos
    const [requisitosModalidad, setRequisitosModalidad] = useState([]); // Estado para los requisitos dinámicos
    const [requisitosCompletados, setRequisitosCompletados] = useState({});
    const [requisitosCompletadosModalidad, setRequisitosCompletadosModalidad] = useState({});
    const [dataFetched, setDataFetched] = useState(false);

    const fetchRequisitos = useCallback(async () => {
        if (dataFetchedRef.current || !citaSeleccionada || !citaSeleccionada.num_Cuenta) {
            setLoading(false);
            return;
        }

        setLoading(true); // Comienza a cargar
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.137.1:8000/api/estudiantes/requisitosdataespecifica/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los requisitos');
            }

            const data = await response.json();
            updateFormData(data); // Actualiza los datos en el formulario

            // Aquí puedes obtener los requisitos y sus estados de cumplimiento
            const requisitosPrograma = data.requisitosPrograma || [];
            const requisitosModalidad = data.requisitosModalidad || [];
            const completionData = data.completados || {};

            const completionStatus = {};

            // Procesamos los requisitos de programa
            requisitosPrograma.forEach(requisito => {
                const status = completionData[`requisito_${requisito.id_requisito_programa}`];
                if (status) {
                    completionStatus[requisito.id_requisito_programa] = {
                        cumplido: status.cumplido,
                        fecha_cumplido: status.fecha_cumplido || '',
                    };
                }
            });

            // Procesamos los requisitos de modalidad
            requisitosModalidad.forEach(requisito => {
                const status = completionData[`requisito_${requisito.id_requisito_modalidad}`];
                if (status) {
                    completionStatus[requisito.id_requisito_modalidad] = {
                        cumplido: status.cumplido,
                        fecha_cumplido: status.fecha_cumplido || '',
                    };
                }
            });

            setRequisitosCompletados(completionStatus);

            // Actualiza formData con el estado de los requisitos
            const updatedFormData = { ...formData };
            requisitosPrograma.forEach(requisito => {
                const status = completionStatus[requisito.id_requisito_programa];
                if (status) {
                    updatedFormData[`requisito_${requisito.id_requisito_programa}`] = status.cumplido;
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_programa}`] = status.fecha_cumplido;
                } else {
                    updatedFormData[`requisito_${requisito.id_requisito_programa}`] = '';
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_programa}`] = '';
                }
            });

            requisitosModalidad.forEach(requisito => {
                const status = completionStatus[requisito.id_requisito_modalidad];
                if (status) {
                    updatedFormData[`requisito_${requisito.id_requisito_modalidad}`] = status.cumplido;
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_modalidad}`] = status.fecha_cumplido;
                } else {
                    updatedFormData[`requisito_${requisito.id_requisito_modalidad}`] = '';
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_modalidad}`] = '';
                }
            });

            updateFormData(updatedFormData);
            setDataFetched(true);
            dataFetchedRef.current = true; // Indica que los datos ya se han obtenido
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Detiene la carga
        }
    }, [citaSeleccionada, updateFormData, formData]);

    useEffect(() => {
        fetchRequisitos();
    }, [fetchRequisitos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    // Navegación a Datos Escolares
    const handleVerClickEscolares = async (e) => {
        e.preventDefault();
        setMostrarDatosEscolares(true);
    };

    // Y dentro de tu useEffect
    useEffect(() => {
        if (mostrarDatosEscolares) {
            fetchRequisitos();
        }
    }, [mostrarDatosEscolares, fetchRequisitos]);

    // Maneja el clic en el botón "Generar Reporte"
    const handleGenerarReporteClick = (e) => {
        e.preventDefault();
        setMostrarGenerarReporte(true);
    };

    const actualizarRequisitos = async () => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                // Requisitos obligatorios
                requisitos_obligatorios: {
                    servicio_social: formData.servicio_social || '',
                    practicas_profecionales: formData.practicas_profecionales || '',
                    cedai: formData.cedai || ''
                },
                // Requisitos del programa
                requisitos_programa: requisitosPrograma.map(requisito => ({
                    id_requisito: requisito.id_requisito_programa,
                    cumplido: formData[`requisito_${requisito.id_requisito_programa}`] || '',
                    fecha_cumplido: formData[`fecha_requisito_${requisito.id_requisito_programa}`] || ''
                })),
                // Requisitos de la modalidad
                requisitos_modalidad: requisitosModalidad.map(requisito => ({
                    id_requisito: requisito.id_requisito_modalidad,
                    cumplido: formData[`requisito_${requisito.id_requisito_modalidad}`] || '',
                }))
            };

            // Enviar la solicitud a la ruta correspondiente
            const response = await fetch(`http://192.168.137.1:8000/api/estudiantes/requisitosCompletos/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al actualizar los requisitos: ${errorData.message || response.statusText}`);
            }

            console.log('Todos los requisitos actualizados con éxito');
        } catch (error) {
            console.error('Error en actualizarRequisitos:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        setMostrarDatosEscolares(false);
        setMostrarDatosborrador(true);
        setMostrarGenerarReporte(false);
        e.preventDefault();
        setLoading(true);

        try {
            await actualizarRequisitos();
            console.log('Todos los requisitos actualizados con éxito');
            // Aquí puedes añadir alguna notificación de éxito para el usuario
        } catch (error) {
            console.error('Error al actualizar requisitos:', error);
            // Aquí puedes añadir alguna notificación de error para el usuario
        } finally {
            setLoading(false);
        }
    };

    if (mostrarDatosEscolares) return <DatosEscolares citaSeleccionada={citaSeleccionada} />;
    if (mostrarDatosborrador) return <StudentDataPreview citaSeleccionada={citaSeleccionada} />;
    if (mostrarGenerarReporte) return <GenerarReporte citaSeleccionada={citaSeleccionada} />;

    if (loading) {
        return (
            <div className="spinner-container">
                <ClipLoader color={"#841816"} loading={loading} size={50} />
            </div>
        );
    }

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
                        <label htmlFor="servicio_social">Servicio Social</label>
                        <input
                            type="text"
                            id="servicio_social"
                            name="servicio_social"
                            value={formData.servicio_social || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="practicas_profecionales">Prácticas Profesionales</label>
                        <input
                            type="text"
                            id="practicas_profecionales"
                            name="practicas_profecionales"
                            value={formData.practicas_profecionales || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-row">
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
                </div>

                {requisitos_programa.length > 0 && (
                    <>
                        {requisitos_programa.map((requisito) => (
                            <div className="form-group" key={requisito.id_requisito_programa}>
                                <label htmlFor={`requisito_programa_${requisito.id_requisito_programa}`}>
                                    {requisito.descripcion}
                                </label>
                                <select
                                    id={`requisito_programa_${requisito.id_requisito_programa}`}
                                    name={`requisito_programa_${requisito.id_requisito_programa}`}
                                    value={formData[`requisito_programa_${requisito.id_requisito_programa}`] || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Incompleto">Incompleto</option>
                                    <option value="Completo">Completo</option>
                                </select>
                                {formData[`requisito_programa_${requisito.id_requisito_programa}`] === 'Completo' && (
                                    <input
                                        type="date"
                                        id={`fecha_requisito_programa_${requisito.id_requisito_programa}`}
                                        name={`fecha_requisito_programa_${requisito.id_requisito_programa}`}
                                        value={formData[`fecha_requisito_programa_${requisito.id_requisito_programa}`] || ''}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </div>
                        ))}
                    </>
                )}

                {requisitos_modalidad.length > 0 && (
                    <>
                        {requisitos_modalidad.map((requisito) => (
                            <div className="form-group" key={requisito.id_requisito_modalidad}>
                                <label htmlFor={`requisito_modalidad_${requisito.id_requisito_modalidad}`}>
                                    {requisito.descripcion}
                                </label>
                                <select
                                    id={`requisito_modalidad_${requisito.id_requisito_modalidad}`}
                                    name={`requisito_modalidad_${requisito.id_requisito_modalidad}`}
                                    value={formData[`requisito_modalidad_${requisito.id_requisito_modalidad}`] || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="Incompleto">Incompleto</option>
                                    <option value="Completo">Completo</option>
                                </select>
                                {formData[`requisito_modalidad_${requisito.id_requisito_modalidad}`] === 'Completo' && (
                                    <input
                                        type="date"
                                        id={`fecha_requisito_modalidad_${requisito.id_requisito_modalidad}`}
                                        name={`fecha_requisito_modalidad_${requisito.id_requisito_modalidad}`}
                                        value={formData[`fecha_requisito_modalidad_${requisito.id_requisito_modalidad}`] || ''}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </div>
                        ))}
                    </>
                )}

                <div className="boton_integracionS">
                    <button onClick={handleVerClickEscolares}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button onClick={handleSubmit}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Requisitos;