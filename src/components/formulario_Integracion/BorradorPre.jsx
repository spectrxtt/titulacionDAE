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

    const handleActualizarEstadoCita = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://10.11.80.237:8000/api/actualizar-estado-cita/${citaSeleccionada.id_cita}`, {
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
    }, [citaSeleccionada.id_cita, estadoCita]);

    // Fetch datos de bachilleratos
    useEffect(() => {
        const fetchBachilleratos = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://10.11.80.237:8000/api/bachilleratos', {
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
                        if (bach && bach.id_bach && bach.nombre_bach && bach.bach_entidad) {
                            bachilleratosMap[bach.id_bach] = {
                                nombre: bach.nombre_bach,
                                entidad: bach.bach_entidad
                            };
                        }
                    });
                }
                setBachilleratos(bachilleratosMap);
            } catch (error) {
                console.error('Error al cargar bachilleratos:', error);
            }
        };

        const fetchProgramasEducativos = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://10.11.80.237:8000/api/programas-educativos', {
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
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://10.11.80.237:8000/api/titulo-otorgado', {
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
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://10.11.80.237:8000/api/modalidades-titulacion', {
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

        // Llamadas a las funciones para cargar datos
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
            const response = await fetch(`http://10.11.80.237:8000/api/estudiantes/requisitos-modalidad/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener requisitos de programa');
            }

            const requisitosModalidad = await response.json();
            setRequisitosModalidad(requisitosModalidad);

            // Fetch completion status for these requirements
            const completionResponse = await fetch(`http://10.11.80.237:8000/api/estudiantes/requisitos-modalidadEs/${citaSeleccionada.num_Cuenta}`, {
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
            const response = await fetch(`http://10.11.80.237:8000/api/estudiantes/requisitos-programa/${citaSeleccionada.num_Cuenta}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Error al obtener requisitos de programa');
            }

            const requisitosPrograma = await response.json();
            setRequisitosPrograma(requisitosPrograma);

            // Fetch completion status for these requirements
            const completionResponse = await fetch(`http://10.11.80.237:8000/api/estudiantes/requisitos-programaEs/${citaSeleccionada.num_Cuenta}`, {
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
    const getBachilleratoInfo = (id) => {
        if (!id) return { nombre: 'No especificado', entidad: 'No especificado' };
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        return bachilleratos[numericId] || { nombre: `Bachillerato ${id}`, entidad: 'No especificado' };
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
    const bachilleratoInfo = getBachilleratoInfo(formData.id_bach);
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
        // Create PDF in portrait mode with mm units
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Set initial configurations
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        // Helper function to center text
        const centerText = (text, y, fontSize = 12) => {
            doc.setFontSize(fontSize);
            const textWidth = doc.getTextWidth(text);
            const x = (pageWidth - textWidth) / 2;
            doc.text(text, x, y);
        };

        // Header
        doc.setFont("helvetica", "bold");
        centerText("La Universidad Autónoma", 30, 18);
        centerText("del Estado de Hidalgo", 40, 18);

        // Title recipient
        doc.setFont("helvetica", "bold");
        centerText("otorga a", 50, 12);

        // Student name
        centerText(`${formData.nombre_estudiante}`, 62, 16);

        // Degree title
        doc.setFont("helvetica", "normal");
        centerText("el título de", 73, 12);

        doc.setFont("helvetica", "bold");
        centerText( `${getTituloOtorgadoNombre(formData.id_titulo_otorgado)}`, 85, 16);

        // Modalidad
        doc.setFont("helvetica", "normal");
        centerText(`Modalidad: ${getModalidadNombre(formData.id_modalidad)}`, 100, 10);

        // Motto and location
        doc.setFont("helvetica", "italic");
        centerText('"Amor, Orden y Progreso"', 110, 10);
        doc.setFont("helvetica", "normal");
        centerText("Dado en la ciudad de Pachuca de Soto, Estado de Hidalgo, México, el día.", 115, 10);

        // Signatures - moved up
        const signatureY = 125; // Ajustado hacia arriba
        const leftColumnX = pageWidth * 0.25;
        const rightColumnX = pageWidth * 0.75;

        // Helper function para centrar texto en una columna
        const centerTextAtX = (text, x, y, fontSize = 12) => {
            doc.setFontSize(fontSize);
            const textWidth = doc.getTextWidth(text);
            const finalX = x - (textWidth / 2);
            doc.text(text, finalX, y);
        };

        // Firma izquierda
        doc.setFont("helvetica", "normal");
        centerTextAtX("El Rector", leftColumnX, signatureY, 10);
        doc.setFont("helvetica", "normal");
        centerTextAtX("Dr. Octavio Castillo Acosta", leftColumnX, signatureY + 5, 10);

        // Firma derecha
        doc.setFont("helvetica", "normal");
        centerTextAtX("El Secretario General", rightColumnX, signatureY, 10);
        doc.setFont("helvetica", "normal");
        centerTextAtX("M. en C. Julio César Leines Medécigo", rightColumnX, signatureY + 5, 10);

        // Academic information - sin recuadro
        let currentY = 150; // Posición inicial para la información académica
        const leftMargin = 30;
        const lineHeight = 6;

        // CURP
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`CURP: ${formData.curp}`, leftMargin, currentY);
        currentY += lineHeight * 2;

        // Estudios de Bachillerato
        doc.setFont("helvetica", "bold");
        doc.text("Estudios de Bachillerato:", leftMargin, currentY);
        currentY += lineHeight * 1.5;

        doc.setFont("helvetica", "normal");
        doc.text(`Institución: ${bachilleratoInfo.nombre}`, leftMargin, currentY);
        currentY += lineHeight;
        doc.text(`Periodo: de ${formData.fecha_inicio_bach} a ${formData.fecha_fin_bach}`, leftMargin, currentY);
        currentY += lineHeight;
        doc.text(`Entidad federativa: ${bachilleratoInfo.entidad} (se registra entidad donde se expide el certificado)`, leftMargin, currentY);
        currentY += lineHeight * 2;

        // Estudios Profesionales
        doc.setFont("helvetica", "bold");
        doc.text("Estudios Profesionales:", leftMargin, currentY);
        currentY += lineHeight * 1.5;

        doc.setFont("helvetica", "normal");
        doc.text("Institución: Universidad Autónoma del Estado de Hidalgo", leftMargin, currentY);
        currentY += lineHeight;
        doc.text(`Carrera: ${getProgramaEducativoNombre(formData.id_programa_educativo)}`, leftMargin, currentY);
        currentY += lineHeight;
        doc.text(`Periodo: de ${formData.fecha_inicio_uni} a ${formData.fecha_fin_uni} (este dato lo arroja el sistema automáticamente)`, leftMargin, currentY);
        currentY += lineHeight;
        doc.text("Entidad federativa: Hidalgo", leftMargin, currentY);
        currentY += lineHeight;
        doc.text("Evaluación profesional: (el dato lo arroja el sistema de forma automática)", leftMargin, currentY);

        // Footer with student ID
        doc.setFontSize(8);
        const accountText = `No. de Cuenta: ${formData.num_Cuenta}`;
        const textWidth = doc.getTextWidth(accountText);
        doc.text(accountText, pageWidth - margin - textWidth, pageHeight - margin);

        doc.save('titulo_universitario.pdf');
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
                        <div className="requirement-value data">
                            {bachilleratoInfo.nombre || 'No especificado'}
                        </div>
                    </div>
                    <div className="requirement-item">
                        <label>Entidad Bachillerato</label>
                        <div className="requirement-value data">
                            {bachilleratoInfo.entidad || 'No especificado'}
                        </div>
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