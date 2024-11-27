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
    const [requisitosPrograma, setRequisitosPrograma] = useState([]);
    const [requisitosModalidad, setRequisitosModalidad] = useState([]);
    const [dataFetched, setDataFetched] = useState(false);

    const fetchRequisitos = useCallback(async () => {
        if (dataFetchedRef.current || !citaSeleccionada?.num_Cuenta) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.111:8000/api/estudiantes/requisitosdataespecifica/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Error al obtener los requisitos');

            const data = await response.json();

            // Guardar los requisitos
            setRequisitosPrograma(data.requisitos_programa || []);
            setRequisitosModalidad(data.requisitos_modalidad || []);

            // Preparar los datos del formulario
            const newFormData = {
                ...formData,
                servicio_social: data.requisitos_obligatorios?.servicio_social || 'Completo',
                practicas_profecionales: data.requisitos_obligatorios?.practicas_profecionales || 'Completo',
                cedai: data.requisitos_obligatorios?.cedai || 'Completo',
            };

            // Process program details
            data.requisitos_programa?.forEach((req, index) => {
                const detalleKey = `id_requisito_${index + 1}`;
                const cumplidoKey = `cumplido_${index + 1}`;
                const fechaKey = `fecha_cumplido_${index + 1}`;

                if (data.detalles_programa[detalleKey] === req.id_requisito_programa) {
                    // Set the exact value from 'cumplidoKey' without conversion
                    newFormData[`requisito_${req.id_requisito_programa}`] = data.detalles_programa[cumplidoKey];
                    newFormData[`fecha_requisito_${req.id_requisito_programa}`] = data.detalles_programa[fechaKey] || '';
                }
            });

            // Procesar detalles de modalidad
            data.requisitos_modalidad?.forEach((req, index) => {
                const detalleKey = `id_requisito_${index + 1}`;
                const cumplidoKey = `cumplido_${index + 1}`;

                if (data.detalles_modalidad[detalleKey] === req.id_requisito_modalidad) {
                    newFormData[`requisito_${req.id_requisito_modalidad}`] = data.detalles_modalidad[cumplidoKey];
                }
            });

            updateFormData(newFormData);
            setDataFetched(true);
            dataFetchedRef.current = true;
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [citaSeleccionada, updateFormData, formData]);

    useEffect(() => {
        fetchRequisitos();
    }, [fetchRequisitos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    const handleVerClickEscolares = (e) => {
        e.preventDefault();
        setMostrarDatosEscolares(true);
    };

    const handleGenerarReporteClick = (e) => {
        e.preventDefault();
        setMostrarGenerarReporte(true);
    };



    const actualizarRequisitos = async () => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                requisitos_obligatorios: {
                    servicio_social: formData.servicio_social || '',
                    practicas_profecionales: formData.practicas_profecionales || '',
                    cedai: formData.cedai || ''
                },
                requisitos_programa: requisitosPrograma.map(requisito => ({
                    id_requisito: requisito.id_requisito_programa,
                    cumplido: formData[`requisito_${requisito.id_requisito_programa}`],
                    fecha_cumplido: formData[`fecha_requisito_${requisito.id_requisito_programa}`] || ''
                })),
                requisitos_modalidad: requisitosModalidad.map(requisito => ({
                    id_requisito: requisito.id_requisito_modalidad,
                    cumplido: formData[`requisito_${requisito.id_requisito_modalidad}`]
                }))
            };

            const response = await fetch(
                `http://10.11.80.111:8000/api/estudiantes/requisitosCompletos/${citaSeleccionada.num_Cuenta}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(dataToSend)
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al actualizar los requisitos: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error en actualizarRequisitos:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await actualizarRequisitos();
            setMostrarDatosEscolares(false);
            setMostrarDatosborrador(true);
            setMostrarGenerarReporte(false);
        } catch (error) {
            console.error('Error al actualizar requisitos:', error);
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
                <RequisitosButton requisitosContent="Requisitos para Datos Escolares"/>
            </div>
            <p>Num. Cuenta: {formData.num_Cuenta}</p>
            <h2>Requisitos</h2>
            <div className="form-container-personales">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="servicio_social">Servicio Social</label>
                        <select
                            id="servicio_social"
                            name="servicio_social"
                            value={formData.servicio_social || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Completo">Completo</option>
                            <option value="Incompleto">Incompleto</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="practicas_profecionales">Prácticas Profesionales</label>
                        <select
                            id="practicas_profecionales"
                            name="practicas_profecionales"
                            value={formData.practicas_profecionales || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Completo">Completo</option>
                            <option value="Incompleto">Incompleto</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="cedai">CEDAI</label>
                        <select
                            id="cedai"
                            name="cedai"
                            value={formData.cedai || ''}
                            onChange={handleInputChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="Completo">Completo</option>
                            <option value="Incompleto">Incompleto</option>
                        </select>
                    </div>
                </div>

                {/* Requisitos de Programa */}
                {requisitosPrograma.length > 0 && (
                    <div className="requisitos-section">
                        <h3>Requisitos del Programa</h3>
                        {requisitosPrograma.map((requisito) => {
                            const fechaRequisito = formData[`fecha_requisito_${requisito.id_requisito_programa}`];
                            const periodoPasantia = formData.periodo_pasantia;

                            // Determinar la clase de color según la comparación de fechas
                            let colorClase = '';
                            if (fechaRequisito && periodoPasantia) {
                                // Convertir `periodoPasantia` de "DD/MM/YYYY" a "YYYY-MM-DD" para compatibilidad
                                const [day, month, year] = periodoPasantia.split('/');
                                const pasantiaDate = new Date(`${year}-${month}-${day}`);

                                // Convertir `fechaRequisito` directamente a Date, ya que está en "YYYY-MM-DD"
                                const requisitoDate = new Date(fechaRequisito);

                                // Comparar las fechas
                                colorClase = requisitoDate.getTime() <= pasantiaDate.getTime() ? 'fecha-pasantia-verde' : 'fecha-pasantia-rojo';
                            }

                            return (
                                <div className="form-group" key={requisito.id_requisito_programa}>
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
                                        <option value="Incompleto">Incompleto</option>
                                        <option value="Completo">Completo</option>
                                    </select>
                                    {formData[`requisito_${requisito.id_requisito_programa}`] === 'Completo' && (
                                        <input
                                            type="date"
                                            id={`fecha_requisito_${requisito.id_requisito_programa}`}
                                            name={`fecha_requisito_${requisito.id_requisito_programa}`}
                                            value={formData[`fecha_requisito_${requisito.id_requisito_programa}`] || ''}
                                            onChange={handleInputChange}
                                            className={colorClase} // Agregar la clase de color
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {requisitosModalidad.length > 0 && (
                    <>
                        {requisitosModalidad.map((requisito, index) => (
                            <div className="form-group" key={index}>
                                <label htmlFor={`requisito_${requisito.id_requisito_modalidad}`}>
                                    {requisito.descripcion}
                                </label>
                                {requisito.id_modalidad === 17 ? (
                                    // Campo de texto para id 17
                                    <input
                                        type="text"
                                        id={`requisito_${requisito.id_requisito_modalidad}`}
                                        name={`requisito_${requisito.id_requisito_modalidad}`}
                                        value={formData[`requisito_${requisito.id_requisito_modalidad}`] || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    // Selector para otros casos
                                    <select
                                        id={`requisito_${requisito.id_requisito_modalidad}`}
                                        name={`requisito_${requisito.id_requisito_modalidad}`}
                                        value={formData[`requisito_${requisito.id_requisito_modalidad}`] || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccionar</option>
                                        <option value="Incompleto">Incompleto</option>
                                        <option value="Completo">Completo</option>
                                    </select>
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
};

export default Requisitos;