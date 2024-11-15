import React, {useState, useEffect, useCallback, useRef} from 'react';
import '../../styles/StudentDataPreview.css';
import Requisitos from './requisitos';
import Integracion from '../Integracion';
import jsPDF from 'jspdf';
import { useFormData } from './integracionDatos';
import { Document, Packer, Paragraph, TextRun } from "docx";
import ClipLoader from "react-spinners/ClipLoader";
import { saveAs } from 'file-saver';



// Define los estados de la cita
const ESTADOS_CITA = [
    { value: 'Enviado, pendiente de validar', label: 'Enviado, pendiente de validar' },
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
    const dataFetchedRef = useRef(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [loading, setLoading] = useState(true);

    const [estadoCita, setEstadoCita] = useState(''); // Estado para el campo de selección

    const handleEstadoChange = (event) => {
        setEstadoCita(event.target.value);
    };

    const handleActualizarEstadoCita = useCallback(async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://10.11.80.188:8000/api/actualizar-estado-cita/${citaSeleccionada.id_cita}`, {
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
                const response = await fetch('http://10.11.80.188:8000/api/bachilleratos', {
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
                const response = await fetch('http://10.11.80.188:8000/api/programas-educativos', {
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
                console.error('Error al cargar programas educativos: ', error);
            }
        };

        const fetchTitulosOtorgados = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://10.11.80.188:8000/api/titulo-otorgado', {
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
                const response = await fetch('http://10.11.80.188:8000/api/modalidades-titulacion', {
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

    const fetchRequisitos = useCallback(async () => {
        if (dataFetchedRef.current || !citaSeleccionada?.num_Cuenta) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.188:8000/api/estudiantes/requisitosdataespecifica/${citaSeleccionada.num_Cuenta}`, {
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
                servicio_social: data.requisitos_obligatorios?.servicio_social || '',
                practicas_profecionales: data.requisitos_obligatorios?.practicas_profecionales || '',
                cedai: data.requisitos_obligatorios?.cedai || ''
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
                {requisitosPrograma.length > 0 && (
                    <div className="program-requirements grid">
                        {requisitosPrograma.map((requisito) => {
                            const requisitoValue = formData[`requisito_${requisito.id_requisito_programa}`];
                            const fechaRequisito = formData[`fecha_cumplido_${requisito.id_requisito_programa}`];

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

        // Ensure each part of the name is included only if it has a value
        const fullName = [
            formData.nombre_estudiante,
            formData.ap_paterno,
            formData.ap_materno
        ].filter(part => part && part !== 'null' && part !== 'No especificado').join(' ');

        // Center the full name in the PDF if not empty
        if (fullName) {
            centerText(fullName, 62, 16);
        }

        // Degree title
        doc.setFont("helvetica", "normal");
        centerText("el título de", 73, 12);

        doc.setFont("helvetica", "bold");
        centerText(`${getTituloOtorgadoNombre(formData.id_titulo_otorgado)}`, 85, 16);


        function numeroATexto(numero) {
            if (isNaN(numero)) {
                return "Número inválido"; // Verifica si el número es inválido
            }

            const entero = Math.floor(numero);
            const decimal = numero - entero;

            const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
            const decenas = ['', '', 'veinti', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
            const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

            let textoEntero = '';
            let textoDecimal = '';

            // Construcción del texto entero
            if (entero === 0) {
                textoEntero = 'cero';
            } else {
                if (entero >= 100) {
                    textoEntero += centenas[Math.floor(entero / 100)];
                    entero %= 100;
                }
                if (entero >= 20) {
                    textoEntero += decenas[Math.floor(entero / 10)];
                    if (entero % 10 !== 0) {
                        textoEntero += ' y ' + unidades[entero % 10];
                    }
                } else {
                    textoEntero += unidades[entero];
                }
            }

            // Construcción del texto decimal
            if (decimal !== 0) {
                textoDecimal = 'punto ';
                const decimalEntero = Math.round(decimal * 100);
                const decimalUnidades = decimalEntero % 10;
                const decimalDecenas = Math.floor(decimalEntero / 10);
                if (decimalDecenas !== 0) {
                    textoDecimal += decenas[decimalDecenas];
                    if (decimalUnidades !== 0) {
                        textoDecimal += ' y ' + unidades[decimalUnidades];
                    }
                } else {
                    textoDecimal += unidades[decimalUnidades];
                }
            }

            return `${textoEntero} ${textoDecimal}`.trim();
        }

// Obtener el nombre de la modalidad
        const modalidadNombre = getModalidadNombre(formData.id_modalidad);

// Condición para mostrar los requisitos
        if (modalidadNombre === 'Alto Rendimiento con promedio de 0.00 (cero punto cero)' || formData.id_modalidad === 17) {
            // Ajustar tamaño y estilo de fuente para el texto de la modalidad
            doc.setFont("helvetica", "normal"); // Asegura que la fuente no esté en negritas
            doc.setFontSize(10); // Ajusta este valor según el tamaño que desees

            // Usar el primer requisito como el promedio
            const primerRequisito = requisitosModalidad.length > 0 ?
                formData[`requisito_${requisitosModalidad[0].id_requisito_modalidad}`] || 'No especificado'
                : 'No especificado';

            // Convertir el primer requisito a texto solo si es un número
            const promedioTexto = !isNaN(primerRequisito) ? numeroATexto(primerRequisito) : 'NO ESPECIFICADO';

            // Texto de modalidad centrado con el primer requisito como "promedio" en ambos formatos
            const modalidadText = `Modalidad: Alto Rendimiento Académico con promedio de ${primerRequisito} (${promedioTexto})`;
            const textWidth = doc.getTextWidth(modalidadText);
            const centerX = (pageWidth - textWidth) / 2;
            doc.text(modalidadText, centerX, 100); // Ajusta la coordenada Y según sea necesario

            // Mostrar los requisitos restantes centrados
            if (requisitosModalidad.length > 1) { // Solo mostrar el resto si hay más de un requisito
                doc.setFontSize(10); // Ajusta este valor según el tamaño que desees para los requisitos
                requisitosModalidad.slice(1).forEach((requisito, index) => {
                    const requisitoValue = formData[`requisito_${requisito.id_requisito_modalidad}`] || 'No especificado';
                    const requisitoTextWidth = doc.getTextWidth(requisitoValue);
                    const requisitoCenterX = (pageWidth - requisitoTextWidth) / 2;
                    doc.text(requisitoValue, requisitoCenterX, 110 + (index * 10)); // Ajusta la coordenada Y para cada requisito
                });
            }
        } else {
            // Ajustar tamaño y estilo de fuente para el nombre de la modalidad sin requisitos
            doc.setFont("helvetica", "normal"); // Asegura que la fuente no esté en negritas
            doc.setFontSize(10); // Ajusta este valor según el tamaño que desees
            const modalidadText = `Modalidad: ${modalidadNombre}`;
            const textWidth = doc.getTextWidth(modalidadText);
            const centerX = (pageWidth - textWidth) / 2;
            doc.text(modalidadText, centerX, 100); // Ajusta la coordenada Y según sea necesario
        }




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
        // Extraer solo el año antes del primer '/'
        const startYear = formData.fecha_inicio_bach.split('-')[0]; // Tomar el año
        const endYear = formData.fecha_fin_bach.split('-')[0]; // Tomar el año

        doc.text(`Periodo: de ${startYear} a ${endYear}`, leftMargin, currentY);
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
        // Suponiendo que las fechas están en formato 'YYYY/MM/DD' en formData

// Extraer solo el año antes del primer '/'
        const startYearU = formData.fecha_inicio_uni.split('-')[0]; // Tomar el año
        const endYearU = formData.fecha_fin_uni.split('-')[0]; // Tomar el año

// Generar el texto con solo los años
        doc.text(`Periodo: de ${startYearU} a ${endYearU} (este dato lo arroja el sistema automáticamente)`, leftMargin, currentY);


        currentY += lineHeight;
        doc.text("Entidad federativa: Hidalgo", leftMargin, currentY);
        currentY += lineHeight;
        doc.text("Evaluación profesional: (el dato lo arroja el sistema de forma automática)", leftMargin, currentY);

        // Footer with student ID
        doc.setFontSize(8);
        const accountText = `No. de Cuenta: ${formData.num_Cuenta}`;
        const textWidth = doc.getTextWidth(accountText);
        doc.text(accountText, pageWidth - margin - textWidth, pageHeight - margin);

        doc.save(`${formData.num_Cuenta}.pdf`);
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
                <h3>DATOS DE BACHILLERATO</h3>
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
                </div>
            </div>
            <div className="section">
                <h3>DATOS DE LICENCIATURA</h3>
                <div className="grid">
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
                        <label>Fecha Limite para titularse</label>
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
                <button onClick={handleVerClickRequisitos}className="generate-button"><i
                    className="fa-solid fa-arrow-left"></i></button>
                <button onClick={generatePDF} className="generate-button">GENERAR BORRADOR</button>

            </div>
            <div className="boton_integracionS">
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

        </div>

    );

};

export default StudentDataPreview;