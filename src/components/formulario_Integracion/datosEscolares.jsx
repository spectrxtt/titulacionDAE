import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosPersonales from './datosPersonales';
import Requisitos from './requisitos';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import RequisitosButton from './infoRequisitos';
import ClipLoader from "react-spinners/ClipLoader";

const DatosEscolares = ({ citaSeleccionada }) => {
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { formData, updateFormData } = useFormData();
    const [loading, setLoading] = useState(true);
    const [bachilleratos, setBachilleratos] = useState([]);
    const [programasEducativos, setProgramasEducativos] = useState([]);
    const [modalidadesTitulacion, setModalidadesTitulacion] = useState([]);
    const dataFetchedRef = useRef(false);

    const today = new Date();

    const fetchData = useCallback(async () => {
        if (dataFetchedRef.current || !citaSeleccionada || !citaSeleccionada.num_Cuenta) {
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const [bachResponse, uniResponse, bachilleratosResponse, programasResponse, modalidadesResponse] = await Promise.all([
                fetch(`http://127.0.0.1:8000/api/estudiantes/bachillerato/${citaSeleccionada.num_Cuenta}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch(`http://127.0.0.1:8000/api/estudiantes/uni/${citaSeleccionada.num_Cuenta}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch('http://127.0.0.1:8000/api/bachilleratos', {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch('http://127.0.0.1:8000/api/programas-educativos', {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch('http://127.0.0.1:8000/api/modalidades-titulacion', {
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            ]);

            if (!bachResponse.ok || !uniResponse.ok || !bachilleratosResponse.ok || !programasResponse.ok || !modalidadesResponse.ok) {
                throw new Error('Error fetching data');
            }

            const [bachData, uniData, bachilleratosData, programasData, modalidadesData] = await Promise.all([
                bachResponse.json(),
                uniResponse.json(),
                bachilleratosResponse.json(),
                programasResponse.json(),
                modalidadesResponse.json()
            ]);

            const newEstudianteData = { ...bachData, ...uniData };
            updateFormData(newEstudianteData);
            setBachilleratos(bachilleratosData);
            setProgramasEducativos(programasData);
            setModalidadesTitulacion(modalidadesData);
            dataFetchedRef.current = true;
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, [citaSeleccionada, updateFormData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (formData.fecha_fin_uni) {
            const [year, month, day] = formData.fecha_fin_uni.split('-');
            const fechaFinUni = new Date(year, month - 1, day);

            if (!isNaN(fechaFinUni.getTime())) {
                const fechaPasantia = new Date(fechaFinUni.getFullYear() + 2, fechaFinUni.getMonth(), fechaFinUni.getDate());
                const dia = String(fechaPasantia.getDate()).padStart(2, '0');
                const mes = String(fechaPasantia.getMonth() + 1).padStart(2, '0');
                const anio = fechaPasantia.getFullYear();
                const fechaCompletaPasantia = `${dia}/${mes}/${anio}`;

                if (formData.periodo_pasantia !== fechaCompletaPasantia) {
                    updateFormData({ periodo_pasantia: fechaCompletaPasantia });
                }
            }
        }
    }, [formData.fecha_fin_uni, formData.periodo_pasantia, updateFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    const actualizarDatosEscolares = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/datos-escolares/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_bach: formData.id_bach,
                    fecha_inicio_bach: formData.fecha_inicio_bach,
                    fecha_fin_bach: formData.fecha_fin_bach,
                    id_programa_educativo: formData.id_programa_educativo,
                    fecha_inicio_uni: formData.fecha_inicio_uni,
                    fecha_fin_uni: formData.fecha_fin_uni,
                    periodo_pasantia: formData.periodo_pasantia,
                    id_modalidad: formData.id_modalidad
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar datos escolares');
            }

            const data = await response.json();
            console.log('Datos escolares actualizados correctamente:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleVerClickPersonales = (e) => {
        e.preventDefault();
        setMostrarDatosPersonales(true);
    };

    const handleVerClickRequisitos = async (e) => {
        e.preventDefault();
        await actualizarDatosEscolares();
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
                <RequisitosButton requisitosContent="Requisitos para licenciatura en derecho: " />
            </div>

            <h2>Datos Escolares</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="bachillerato">Bachillerato procedencia</label>
                    <select
                        id="bachillerato"
                        name="id_bach"
                        value={formData.id_bach || ''}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione un bachillerato</option>
                        {bachilleratos.map((bach, index) => (
                            <option key={bach.id_bach ? bach.id_bach : index} value={bach.id_bach}>
                                {bach.nombre_bach}
                            </option>
                        ))}
                    </select>

                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="fechaInBach">Fecha inicio</label>
                        <input
                            type="date"
                            id="fechaInBach"
                            name="fecha_inicio_bach"
                            value={formData.fecha_inicio_bach || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinBach">Fecha Finalización</label>
                        <input
                            type="date"
                            id="fechaFinBach"
                            name="fecha_fin_bach"
                            value={formData.fecha_fin_bach || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="programa">Programa Educativo</label>
                        <select
                            id="programa"
                            name="id_programa_educativo"
                            value={formData.id_programa_educativo || ''}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione un programa educativo</option>
                            {programasEducativos.map(programa => (
                                <option key={programa.id_programa_educativo} value={programa.id_programa_educativo}>
                                    {programa.programa_educativo}
                                </option>
                            ))}
                        </select>


                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_inicio_uni">Fecha Inicio Universidad</label>
                        <input
                            id="fecha_inicio_uni"
                            type="date"
                            name="fecha_inicio_uni"
                            value={formData.fecha_inicio_uni}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fecha_fin_uni">Fecha Fin Universidad</label>
                        <input
                            id="fecha_fin_uni"
                            type="date"
                            name="fecha_fin_uni"
                            value={formData.fecha_fin_uni || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-group-personales">
                    <label htmlFor="periodo_pasantia">Periodo de Pasantía</label>
                    <input
                        id="periodo_pasantia"
                        type="text"
                        name="periodo_pasantia"
                        value={formData.periodo_pasantia || ''}
                        readOnly
                        className={
                            formData.periodo_pasantia && new Date(formData.periodo_pasantia.split('/').reverse().join('-')) < today
                                ? 'fecha-pasantia-rojo'
                                : 'fecha-pasantia-verde'
                        }
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modalidad">Modalidad de titulación</label>
                    <select
                        id="modalidad"
                        name="id_modalidad"
                        value={formData.id_modalidad || ''}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione la modalidad de titulacion</option>
                        {modalidadesTitulacion.map(modalidad => (
                            <option key={modalidad.id_modalidad} value={modalidad.id_modalidad}>
                                {modalidad.modalidad_titulacion}
                            </option>
                        ))}
                    </select>
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