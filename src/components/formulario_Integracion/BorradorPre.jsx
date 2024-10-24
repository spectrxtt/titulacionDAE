import React, {useState, useEffect, useCallback, useRef} from 'react';
import '../../styles/StudentDataPreview.css';
import Requisitos from './requisitos';
import Integracion from '../Integracion';
import jsPDF from 'jspdf';
import { useFormData } from './integracionDatos';
import ClipLoader from "react-spinners/ClipLoader";

// Define los estados de la cita
const ESTADOS_CITA = [
    { value: 'Pendiente de aprobacion de egresado', label: 'Pendiente de aprobación de egresado ' },
    { value: 'Pendiente de aprobación de impresion', label: 'Pendiente de aprobación de impresion' },
    { value: 'Integrado', label: 'Integrado' },
];

const StudentDataPreview = ({ citaSeleccionada }) => {
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const [mostrarIntegracion, setMostrarIntegracion] = useState(false);
    const { formData, updateFormData } = useFormData();
    const [bachilleratos, setBachilleratos] = useState({});
    const [programasEducativos, setProgramasEducativos] = useState({});
    const [titulosOtorgados, setTitulosOtorgados] = useState({});
    const [modalidades, setModalidades] = useState({});
    const [requisitosPrograma, setRequisitosPrograma] = useState([]);
    const [requisitosModalidad, setRequisitosModalidad] = useState([]);
    const [requisitosCompletados, setRequisitosCompletados] = useState({});
    const [requisitosCompletadosModalidad, setRequisitosCompletadosModalidad] = useState({});
    const [dataFetched, setDataFetched] = useState(false);
    const [loading, setLoading] = useState(true);

    const [estadoCita, setEstadoCita] = useState(''); // Estado para el campo de selección

    const handleEstadoChange = (event) => {
        setEstadoCita(event.target.value); // Actualiza el estado del campo
    };

    const handleActualizarEstadoCita = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/actualizar-estado-cita/${citaSeleccionada.id_cita}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ estado_cita: estadoCita }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el estado de la cita');
            }

            const result = await response.json();
            console.log(result.message);

            // Cambia el estado para mostrar el componente Integracion
            setMostrarIntegracion(true);

        } catch (error) {
            console.error('Error:', error);
        }
    };



    // Fetch bachilleratos data
    useEffect(() => {
        const fetchBachilleratos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/bachilleratos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar bachilleratos');
                }

                const data = await response.json();
                const bachilleratosMap = {};
                if (Array.isArray(data)) {
                    data.forEach(bach => {
                        if (bach && bach.id_bach && bach.nombre_bach) {
                            bachilleratosMap[bach.id_bach] = bach.nombre_bach;
                        }
                    });
                }
                setBachilleratos(bachilleratosMap);
            } catch (error) {
                console.error('Error al cargar bachilleratos:', error);
            }
        };

        const fetchProgramasEducativos = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/programas-educativos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar programas educativos');
                }

                const data = await response.json();
                const programasMap = {};
                if (Array.isArray(data)) {
                    data.forEach(programa => {
                        if (programa && programa.id_programa_educativo && programa.programa_educativo) {
                            programasMap[programa.id_programa_educativo] = programa.programa_educativo;
                        }
                    });
                }
                setProgramasEducativos(programasMap);
            } catch (error) {
                console.error('Error al cargar programas educativos:', error);
            }
        };

        const fetchTitulosOtorgados = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/titulo-otorgado', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar títulos otorgados');
                }

                const data = await response.json();
                const titulosMap = {};
                if (Array.isArray(data)) {
                    data.forEach(titulo => {
                        if (titulo && titulo.id_titulo_otorgado && titulo.titulo_otorgado) {
                            titulosMap[titulo.id_titulo_otorgado] = titulo.titulo_otorgado;
                        }
                    });
                }
                setTitulosOtorgados(titulosMap);
            } catch (error) {
                console.error('Error al cargar títulos otorgados:', error);
            }
        };

        const fetchModalidades = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://127.0.0.1:8000/api/modalidades-titulacion', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar modalidades');
                }

                const data = await response.json();
                const modalidadesMap = {};
                if (Array.isArray(data)) {
                    data.forEach(modalidad => {
                        if (modalidad && modalidad.id_modalidad && modalidad.modalidad_titulacion) {
                            modalidadesMap[modalidad.id_modalidad] = modalidad.modalidad_titulacion;
                        }
                    });
                }
                setModalidades(modalidadesMap);
            } catch (error) {
                console.error('Error al cargar modalidades:', error);
            }
        };

        fetchBachilleratos();
        fetchProgramasEducativos();
        fetchTitulosOtorgados();
        fetchModalidades();
    }, []);

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

            Object.keys(completionData).forEach((key) => {
                if (key.startsWith('id_requisito_')) {
                    const index = key.split('_')[2]; // Obtener el índice
                    const idRequisito = completionData[key];
                    const cumplido = completionData[`cumplido_${index}`];

                    if (idRequisito !== null && idRequisito !== undefined) {
                        completionStatus[idRequisito] = {
                            cumplido: cumplido === null ? '' : cumplido,
                        };
                    }
                }
            });


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
        fetchRequisitosPrograma();
        fetchRequisitosModalidad();
    }, [fetchRequisitosPrograma, fetchRequisitosModalidad]);



    const getBachilleratoNombre = (id) => {
        if (!id) return '';
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return bachilleratos[numericId] || `Bachillerato ${id}`;
    };

    const getProgramaEducativoNombre = (id) => {
        if (!id) return '';
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return programasEducativos[numericId] || `Programa Educativo ${id}`;
    };

    const getTituloOtorgadoNombre = (id) => {
        if (!id) return '';
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return titulosOtorgados[numericId] || `Título ${id}`;
    };

    const getModalidadNombre = (id) => {
        if (!id) return '';
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return modalidades[numericId] || `Modalidad ${id}`;
    };

    const renderRequisitos = () => {
        return (
            <div className="requirements-section">
                {/* Requisitos fijos */}
                <div className="grid first-group">
                    <div className="requirement-item">
                        <label>Servicio Social</label>
                        <span
                            className={`requirement-value ${formData.servicio_social === 'Sí' ? 'completed' : 'data'}`}>
                        {formData.servicio_social || 'No especificado'}
                    </span>
                    </div>
                    <div className="requirement-item">
                    <label>Prácticas Profesionales</label>
                        <span className={`requirement-value ${formData.practicas_profecionales === 'Sí' ? 'completed' : 'data'}`}>
                        {formData.practicas_profecionales || 'No especificado'}
                    </span>
                    </div>
                    <div className="requirement-item">
                        <label>CEDAI</label>
                        <span className={`requirement-value ${formData.cedai === 'Sí' ? 'completed' : 'data'}`}>
                        {formData.cedai || 'No especificado'}
                    </span>
                    </div>
                </div>

                {/* Requisitos del programa */}
                {/* Requisitos del programa */}
                {requisitosPrograma.length > 0 && (
                    <div className="program-requirements grid">
                        {requisitosPrograma.map((requisito) => {
                            const requisitoValue = formData[`requisito_${requisito.id_requisito_programa}`];
                            const fechaRequisito = formData[`fecha_requisito_${requisito.id_requisito_programa}`];

                            return (
                                <div className="requirement-item" key={`program_${requisito.id_requisito_programa}`}>
                                    <label>{requisito.descripcion}</label>
                                    <span className="requirement-value data">
                        {requisitoValue || 'No especificado'}
                    </span>
                                    {requisitoValue === 'Sí' && fechaRequisito && (
                                        <span className="requirement-date">
                            Fecha: {new Date(fechaRequisito).toLocaleDateString()}
                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Requisitos de la modalidad */}
                {requisitosModalidad.length > 0 && (
                    <div className="modality-requirements grid">
                        {requisitosModalidad.map((requisito) => {
                            const requisitoValue = formData[`requisito_${requisito.id_requisito_modalidad}`] || 'No especificado';

                            return (
                                <div className="requirement-item" key={`modality_${requisito.id_requisito_modalidad}`}>
                                    <label>{requisito.descripcion}</label>
                                    <span className="requirement-value data">
                        {requisitoValue}
                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}


            </div>
        );
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        let yPosition = 10;
        const lineHeight = 10;
        const margin = 10;

        // Función helper para agregar texto y actualizar la posición Y
        const addText = (text) => {
            doc.text(text, margin, yPosition);
            yPosition += lineHeight;
        };

        doc.setFontSize(16);
        addText("DATOS ESTUDIANTES - DATOS INTEGRADOS");

        doc.setFontSize(12);
        yPosition += 5;

        // Datos Personales
        addText("DATOS PERSONALES");
        addText(`Número de cuenta: ${formData.num_Cuenta || ''}`);
        addText(`Nombre: ${formData.nombre_estudiante || ''}`);
        addText(`Apellido Paterno: ${formData.ap_paterno || ''}`);
        addText(`Apellido Materno: ${formData.ap_materno || ''}`);
        addText(`CURP: ${formData.curp || ''}`);
        addText(`Género: ${formData.genero || ''}`);
        addText(`Entidad Federativa: ${formData.estado || ''}`);
        addText(`País: ${formData.pais || ''}`);

        yPosition += 5;

        // Datos Escolares
        addText("DATOS ESCOLARES");
        addText(`Bachillerato: ${getBachilleratoNombre(formData.id_bach)}`);
        addText(`Fecha Inicio Bachillerato: ${formData.fecha_inicio_bach || ''}`);
        addText(`Fecha Fin Bachillerato: ${formData.fecha_fin_bach || ''}`);
        addText(`Programa Educativo: ${getProgramaEducativoNombre(formData.id_programa_educativo)}`);
        addText(`Título Otorgado: ${getTituloOtorgadoNombre(formData.id_titulo_otorgado)}`);
        addText(`Fecha Inicio Licenciatura: ${formData.fecha_inicio_uni || ''}`);
        addText(`Fecha Fin Licenciatura: ${formData.fecha_fin_uni || ''}`);
        addText(`Estado Pasantía: ${formData.periodo_pasantia || ''}`);
        addText(`Modalidad de Titulación: ${getModalidadNombre(formData.id_modalidad)}`);

        // Cambiar a una nueva página para los requisitos
        doc.addPage();
        yPosition = margin; // Reiniciar la posición en la nueva página

        // Requisitos
        addText("REQUISITOS");

        // Requisitos fijos
        addText(`Servicio Social: ${formData.servicio_social || 'No especificado'}`);
        addText(`Prácticas Profesionales: ${formData.practicas_profecionales || 'No especificado'}`);
        addText(`CEDAI: ${formData.cedai || 'No especificado'}`);

        // Requisitos del programa
        if (requisitosPrograma.length > 0) {
            yPosition += 5;
            addText("Requisitos del Programa:");
            requisitosPrograma.forEach(requisito => {
                const requisitoValue = formData[`requisito_${requisito.id_requisito_programa}`];
                const fechaRequisito = formData[`fecha_requisito_${requisito.id_requisito_programa}`];
                if (requisitoValue) {
                    let texto = `${requisito.descripcion}: ${requisitoValue}`;
                    if (requisitoValue === 'Sí' && fechaRequisito) {
                        texto += ` (Fecha: ${new Date(fechaRequisito).toLocaleDateString()})`;
                    }
                    addText(texto);
                }
            });
        }

        // Requisitos de la modalidad
        if (requisitosModalidad.length > 0) {
            yPosition += 5;
            addText("Requisitos de la Modalidad:");

            requisitosModalidad.forEach(requisito => {
                // Asignar un valor predeterminado si requisitoValue es undefined o null
                const requisitoValue = formData[`requisito_${requisito.id_requisito_modalidad}`] || 'No especificado';

                // Generar texto con el valor
                let texto = `${requisito.descripcion}: ${requisitoValue}`;
                addText(texto);
            });
        }


        doc.save('student_data_preview.pdf');
    };

    const handleVerClickRequisitos = () => setMostrarDatosRequisitos(true);
    // Si mostrarIntegracion es true, renderiza el componente Integracion
    if (mostrarIntegracion) {
        return <Integracion />;
    }
    if (mostrarDatosRequisitos) {
        return <Requisitos citaSeleccionada={citaSeleccionada} />;
    }
    if (loading) {
        return (
            <div className="spinner-container">
                <ClipLoader color={"#841816"} loading={loading} size={50} />
            </div>
        );
    }

    return (
        <div className="student-data-preview">
            <h2>DATOS ESTUDIANTES - DATOS INTEGRADOS</h2>

            <div className="section">
                <h3>DATOS PERSONALES</h3>
                <div className="grid">
                    <div className="requirement-item">
                        <label>Número de cuenta</label>
                        <div className="requirement-value data">{formData.num_Cuenta || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Nombre</label>
                        <div className="requirement-value data">{formData.nombre_estudiante || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Apellido Paterno</label>
                        <div className="requirement-value data">{formData.ap_paterno || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Apellido Materno</label>
                        <div className="requirement-value data">{formData.ap_materno || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item curp">
                        <label>CURP</label>
                        <div className="requirement-value data">{formData.curp || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Género</label>
                        <div className="requirement-value data">{formData.genero || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Entidad Federativa</label>
                        <div className="requirement-value data">{formData.estado || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>País</label>
                        <div className="requirement-value data">{formData.pais || 'No especificado'}</div>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>DATOS ESCOLARES</h3>
                <div className="grid">
                    <div className="requirement-item">
                        <label>Bachillerato</label>
                        <div
                            className="requirement-value data">{getBachilleratoNombre(formData.id_bach) || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Fecha Inicio Bachillerato</label>
                        <div className="requirement-value data">{formData.fecha_inicio_bach || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Fecha Fin Bachillerato</label>
                        <div className="requirement-value data">{formData.fecha_fin_bach || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Programa Educativo</label>
                        <div
                            className="requirement-value data">{getProgramaEducativoNombre(formData.id_programa_educativo) || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Título Otorgado</label>
                        <div
                            className="requirement-value data">{getTituloOtorgadoNombre(formData.id_titulo_otorgado) || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Fecha Inicio Licenciatura</label>
                        <div className="requirement-value data">{formData.fecha_inicio_uni || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Fecha Fin Licenciatura</label>
                        <div className="requirement-value data">{formData.fecha_fin_uni || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Estado Pasantía</label>
                        <div className="requirement-value data">{formData.periodo_pasantia || 'No especificado'}</div>
                    </div>
                    <div className="requirement-item">
                        <label>Modalidad de Titulación</label>
                        <div
                            className="requirement-value data">{getModalidadNombre(formData.id_modalidad) || 'No especificado'}</div>
                    </div>
                </div>
            </div>

            <div className="section">
                <h3>REQUISITOS</h3>
                {renderRequisitos()}
            </div>

            <div className="buttons">
                <button onClick={handleVerClickRequisitos} className="edit-button">EDITAR</button>
                <button onClick={generatePDF} className="generate-button">GENERAR BORRADOR</button>

            </div>
            <select value={estadoCita} onChange={handleEstadoChange}>
                <option value="">Seleccionar estado</option>
                {ESTADOS_CITA.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                        {estado.label}
                    </option>
                ))}
            </select>
            <button onClick={handleActualizarEstadoCita} className="generate-button">Actualizar</button>

        </div>

    );

};

export default StudentDataPreview;