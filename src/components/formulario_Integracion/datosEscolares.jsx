import React, { useState, useEffect, useRef } from 'react';
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
    const formUpdated = useRef(false);

    useEffect(() => {
        const fetchDatosEscolares = async () => {
            if (!citaSeleccionada || !citaSeleccionada.num_Cuenta) {
                console.log('No hay número de cuenta disponible');
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const [bachResponse, uniResponse] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/estudiantes/bachillerato/${citaSeleccionada.num_Cuenta}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`http://127.0.0.1:8000/api/estudiantes/uni/${citaSeleccionada.num_Cuenta}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                ]);

                if (!bachResponse.ok || !uniResponse.ok) {
                    throw new Error('Error al obtener datos escolares');
                }

                const [bachData, uniData] = await Promise.all([
                    bachResponse.json(),
                    uniResponse.json()
                ]);

                const combinedData = { ...bachData, ...uniData };
                updateFormData(combinedData);
                formUpdated.current = true;
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDatosEscolares();
    }, [citaSeleccionada, updateFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    const actualizarDatosEscolares = async () => {
        try {
            const token = localStorage.getItem('token');
            const bachResponse = await fetch(`http://127.0.0.1:8000/api/estudiantes/bachillerato/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_bach: formData.id_bach,
                    fecha_inicio_bach: formData.fecha_inicio_bach,
                    fecha_fin_bach: formData.fecha_fin_bach
                })
            });

            const uniResponse = await fetch(`http://127.0.0.1:8000/api/estudiantes/uni/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_programa_educativo: formData.id_programa_educativo,
                    fecha_inicio_uni: formData.fecha_inicio_uni,
                    fecha_fin_uni: formData.fecha_fin_uni,
                    periodo_pasantia: formData.periodo_pasantia,
                    id_modalidad: formData.id_modalidad
                })
            });

            if (!bachResponse.ok || !uniResponse.ok) {
                throw new Error('Error al actualizar datos escolares');
            }

            console.log('Datos escolares actualizados correctamente');
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
                    <input
                        type="text"
                        id="bachillerato"
                        name="id_bach"
                        value={formData.id_bach || ''}
                        onChange={handleChange}
                    />
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
                        <input
                            type="text"
                            id="programa"
                            name="id_programa_educativo"
                            value={formData.id_programa_educativo || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaInLic">Fecha inicio</label>
                        <input
                            type="date"
                            id="fechaInLic"
                            name="fecha_inicio_uni"
                            value={formData.fecha_inicio_uni || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="fechaFinLic">Fecha Finalización</label>
                        <input
                            type="date"
                            id="fechaFinLic"
                            name="fecha_fin_uni"
                            value={formData.fecha_fin_uni || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-group-personales">
                    <label htmlFor="pasantia">Periodo de pasantía</label>
                    <input
                        type="text"
                        id="pasantia"
                        name="periodo_pasantia"
                        value={formData.periodo_pasantia || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="modalidad">Modalidad de titulación</label>
                    <input
                        type="text"
                        id="modalidad"
                        name="id_modalidad"
                        value={formData.id_modalidad || ''}
                        onChange={handleChange}
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