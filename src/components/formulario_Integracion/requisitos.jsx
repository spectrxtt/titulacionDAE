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

    // Función para obtener los requisitos obligatorios
    const fetchRequisitos = useCallback(async () => {
        if (dataFetchedRef.current || !citaSeleccionada || !citaSeleccionada.num_Cuenta) {
            setLoading(false);
            return;
        }

        setLoading(true); // Comienza a cargar
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-obligatorios/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener requisitos');
            }

            const data = await response.json();
            updateFormData(data); // Actualiza los datos en el formulario
            dataFetchedRef.current = true; // Indica que los datos ya se han obtenido
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Detiene la carga
        }
    }, [citaSeleccionada, updateFormData]);

    const fetchRequisitosModalidad = useCallback(async () => {
        if (!citaSeleccionada || !citaSeleccionada.num_Cuenta || dataFetched) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-modalidad/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener requisitos de programa');
            }

            const requisitosModalidad = await response.json();
            setRequisitosModalidad(requisitosModalidad);

            // Fetch completion status for these requirements
            const completionResponse = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-modalidadEs/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!completionResponse.ok) {
                throw new Error('Error al obtener estado de cumplimiento de requisitos');
            }

            const completionData = await completionResponse.json();
            console.log('Completion data received:', completionData);

            const completionStatus = {};

            if (typeof completionData === 'object' && completionData !== null) {
                for (let i = 1; i <= Object.keys(completionData).length / 3; i++) {
                    const idRequisito = completionData[`id_requisito_${i}`];
                    const cumplido = completionData[`cumplido_${i}`];

                    if (idRequisito !== null && idRequisito !== undefined) {
                        completionStatus[idRequisito] = {
                            cumplido: cumplido === null ? '' : cumplido,
                        };
                    }
                }
            }

            setRequisitosCompletadosModalidad(completionStatus);

            // Update formData with completion status
            const updatedFormData = { ...formData };
            requisitosModalidad.forEach(requisito => {
                const status = completionStatus[requisito.id_requisito_modalidad];
                if (status) {
                    updatedFormData[`requisito_${requisito.id_requisito_modalidad}`] = status.cumplido;
                } else {
                    // If no status found, set fields to empty strings
                    updatedFormData[`requisito_${requisito.id_requisito_modalidad}`] = '';
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_modalidad}`] = '';
                }
            });
            updateFormData(updatedFormData);
            setDataFetched(true);

        } catch (error) {
            console.error('Error in fetchRequisitosModalidad:', error);
        } finally {
            setLoading(false);
        }
    }, [citaSeleccionada, updateFormData, formData, dataFetched]);

    const fetchRequisitosPrograma = useCallback(async () => {
        if (!citaSeleccionada || !citaSeleccionada.num_Cuenta || dataFetched) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-programa/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener requisitos de programa');
            }

            const requisitosPrograma = await response.json();
            setRequisitosPrograma(requisitosPrograma);

            // Fetch completion status for these requirements
            const completionResponse = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-programaEs/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!completionResponse.ok) {
                throw new Error('Error al obtener estado de cumplimiento de requisitos');
            }

            const completionData = await completionResponse.json();

            const completionStatus = {};

            if (typeof completionData === 'object' && completionData !== null) {
                for (let i = 1; i <= Object.keys(completionData).length / 3; i++) {
                    const idRequisito = completionData[`id_requisito_${i}`];
                    const cumplido = completionData[`cumplido_${i}`];
                    const fechaCumplido = completionData[`fecha_cumplido_${i}`];

                    if (idRequisito !== null && idRequisito !== undefined) {
                        completionStatus[idRequisito] = {
                            cumplido: cumplido === null ? '' : cumplido,
                            fecha_cumplido: fechaCumplido || ''
                        };
                    }
                }
            }

            setRequisitosCompletados(completionStatus);

            // Update formData with completion status
            const updatedFormData = { ...formData };
            requisitosPrograma.forEach(requisito => {
                const status = completionStatus[requisito.id_requisito_programa];
                if (status) {
                    updatedFormData[`requisito_${requisito.id_requisito_programa}`] = status.cumplido;
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_programa}`] = status.fecha_cumplido;
                } else {
                    // If no status found, set fields to empty strings
                    updatedFormData[`requisito_${requisito.id_requisito_programa}`] = '';
                    updatedFormData[`fecha_requisito_${requisito.id_requisito_programa}`] = '';
                }
            });
            updateFormData(updatedFormData);
            setDataFetched(true);

        } catch (error) {
            console.error('Error in fetchRequisitosPrograma:', error);
        } finally {
            setLoading(false);
        }
    }, [citaSeleccionada, updateFormData, formData, dataFetched]);

    useEffect(() => {
        fetchRequisitos();
        fetchRequisitosPrograma();
        fetchRequisitosModalidad();
    }, [fetchRequisitos, fetchRequisitosPrograma, fetchRequisitosModalidad]);

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
            fetchRequisitosPrograma();
            fetchRequisitosModalidad();
        }
    }, [mostrarDatosEscolares, fetchRequisitos, fetchRequisitosPrograma, fetchRequisitosModalidad]);


    // Maneja el clic en el botón "Generar Reporte"
    const handleGenerarReporteClick = (e) => {
        e.preventDefault();
        setMostrarGenerarReporte(true);
    };

    const actualizarRequisitosObligatorios = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-obligatorios/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    servicio_social: formData.servicio_social,
                    practicas_profecionales: formData.practicas_profecionales,
                    cedai: formData.cedai
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al actualizar requisitos obligatorios: ${errorData.message || response.statusText}`);
            }

            console.log('Requisitos obligatorios actualizados con éxito');
        } catch (error) {
            console.error('Error en actualizarRequisitosObligatorios:', error);
            throw error;
        }
    };

    const actualizarRequisitosPrograma = async () => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {};

            requisitosPrograma.forEach((requisito, index) => {
                const reqNumber = index + 1;
                const idField = `id_requisito_${reqNumber}`;
                const cumplidoField = `cumplido_${reqNumber}`;
                const fechaField = `fecha_cumplido_${reqNumber}`;

                dataToSend[idField] = requisito.id_requisito_programa;
                dataToSend[cumplidoField] = formData[`requisito_${requisito.id_requisito_programa}`] || '';
                dataToSend[fechaField] = formData[`fecha_requisito_${requisito.id_requisito_programa}`] || '';
            });

            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-programaEs/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            console.log('Respuesta del servidor:', response.status, response.statusText);

            if (!response.ok) {
                const textResponse = await response.text();
                console.log('Respuesta de error completa:', textResponse);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            console.log('Respuesta JSON del servidor:', jsonResponse);

            console.log('Requisitos del programa actualizados con éxito');
        } catch (error) {
            console.error('Error detallado en actualizarRequisitosPrograma:', error);
            throw error;
        }
    };

    const actualizarRequisitosModalidad = async () => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {};

            requisitosModalidad.forEach((requisito, index) => {
                const reqNumber = index + 1;
                const idField = `id_requisito_${reqNumber}`;
                const cumplidoField = `cumplido_${reqNumber}`;


                dataToSend[idField] = requisito.id_requisito_modalidad;
                dataToSend[cumplidoField] = formData[`requisito_${requisito.id_requisito_modalidad}`] || '';
            });

            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-modalidadEs/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            console.log('Respuesta del servidor:', response.status, response.statusText);

            if (!response.ok) {
                const textResponse = await response.text();
                console.log('Respuesta de error completa:', textResponse);
                throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
            }

            const jsonResponse = await response.json();
            console.log('Respuesta JSON del servidor:', jsonResponse);

            console.log('Requisitos de la modalidad actualizados con éxito');
        } catch (error) {
            console.error('Error detallado en actualizarRequisitosPrograma:', error);
            throw error;
        }
    };


    const handleSubmit =async (e) => {
        setMostrarDatosEscolares(false);
        setMostrarDatosborrador(true);
        setMostrarGenerarReporte(false);
        e.preventDefault();
        setLoading(true);

        try {
            await actualizarRequisitosObligatorios();
            await actualizarRequisitosPrograma();
            await actualizarRequisitosModalidad();


            console.log('Todos los requisitos actualizados con éxito');
            // Aquí puedes añadir alguna notificación de éxito para el usuario
        } catch (error) {
            console.error('Error al actualizar requisitos:', error);
            // Aquí puedes añadir alguna notificación de error para el usuario
        } finally {
            setLoading(false);
        }
    };


    if (mostrarDatosEscolares) return <DatosEscolares citaSeleccionada={citaSeleccionada}/>;
    if (mostrarDatosborrador) return <StudentDataPreview citaSeleccionada={citaSeleccionada}/>;
    if (mostrarGenerarReporte) return <GenerarReporte citaSeleccionada={citaSeleccionada}/>;

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

                {requisitosPrograma.length > 0 && (
                    <>
                        {requisitosPrograma.map((requisito, index) => (
                            <div className="form-group" key={index}>
                                <label htmlFor={`requisito_${requisito.id_requisito_programa}`}>
                                    {requisito.descripcion}
                                </label>
                                <select
                                    id={`requisito_${requisito.id_requisito_programa}`}
                                    name={`requisito_${requisito.id_requisito_programa}`}
                                    value={formData[`requisito_${requisito.id_requisito_programa}`] || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="No">No</option>
                                    <option value="Sí">Sí</option>
                                </select>
                                {formData[`requisito_${requisito.id_requisito_programa}`] === 'Sí' && (
                                    <input
                                        type="date"
                                        id={`fecha_requisito_${requisito.id_requisito_programa}`}
                                        name={`fecha_requisito_${requisito.id_requisito_programa}`}
                                        value={formData[`fecha_requisito_${requisito.id_requisito_programa}`] || ''}
                                        onChange={handleInputChange}
                                    />
                                )}
                            </div>
                        ))}
                    </>
                )}

                {requisitosModalidad.length > 0 && (
                    <>
                        {requisitosModalidad.map((requisito, index) => (
                            <div className="form-group" key={index}>
                                <label htmlFor={`requisito_${requisito.id_requisito_modalidad}`}>
                                    {requisito.descripcion}
                                </label>
                                <select
                                    id={`requisito_${requisito.id_requisito_modalidad}`}
                                    name={`requisito_${requisito.id_requisito_modalidad}`}
                                    value={formData[`requisito_${requisito.id_requisito_modalidad}`] || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="No">No</option>
                                    <option value="Sí">Sí</option>
                                </select>
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
