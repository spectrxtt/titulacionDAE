import React, { useState, useEffect } from 'react';
import '../../styles/StudentDataPreview.css';
import Requisitos from './requisitos';
import jsPDF from 'jspdf';
import { useFormData } from './integracionDatos';

const StudentDataPreview = ({ citaSeleccionada }) => {
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const { formData, updateFormData } = useFormData();
    const [bachilleratos, setBachilleratos] = useState({});
    const [programasEducativos, setProgramasEducativos] = useState({});
    const [titulosOtorgados, setTitulosOtorgados] = useState({});
    const [modalidades, setModalidades] = useState({});
    const [requisitosPrograma, setRequisitosPrograma] = useState([]);
    const [requisitosModalidad, setRequisitosModalidad] = useState([]);

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

    useEffect(() => {
        const fetchRequisitos = async () => {
            if (!formData.id_programa_educativo || !formData.id_modalidad) return;

            try {
                const token = localStorage.getItem('token');

                // Fetch requisitos programa
                const responsePrograma = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-programaEs/${formData.num_Cuenta}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                });

                if (responsePrograma.ok) {
                    const dataPrograma = await responsePrograma.json();
                    console.log('Requisitos Programa:', dataPrograma); // Aquí
                    setRequisitosPrograma(Array.isArray(dataPrograma) ? dataPrograma : []);
                }

                // Fetch requisitos modalidad
                const responseModalidad = await fetch(`http://127.0.0.1:8000/api/estudiantes/requisitos-modalidadEs/${formData.num_Cuenta}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                });

                if (responseModalidad.ok) {
                    const dataModalidad = await responseModalidad.json();
                    console.log('Requisitos Modalidad:', dataModalidad); // Aquí
                    setRequisitosModalidad(Array.isArray(dataModalidad) ? dataModalidad : []);
                }
            } catch (error) {
                console.error('Error al cargar requisitos:', error);
            }
        };

        fetchRequisitos();
    }, [formData.id_programa_educativo, formData.id_modalidad]);

    const renderRequisitos = () => {
        const requisitoInputs = [];

        // Agregar requisitos originales fijos
        const requisitosOriginales = [
            { label: "Servicio Social", value: formData.servicio_social },
            { label: "Prácticas Profesionales", value: formData.practicas_profecionales },
            { label: "CEDAI", value: formData.cedai },
        ];

        requisitosOriginales.forEach(({ label, value }) => {
            if (value) {
                requisitoInputs.push(
                    <div key={label}>
                        <label>{label}:</label>
                        <span>{value}</span>
                    </div>
                );
            }
        });

        // Agregar requisitos del programa
        requisitosPrograma.forEach((requisito) => {
            const requisitoValue = formData[`requisito_${requisito.id_requisito_programa}`];
            const fechaRequisito = formData[`fecha_requisito_${requisito.id_requisito_programa}`];

            if (requisitoValue) {
                requisitoInputs.push(
                    <div key={`requisito_programa_${requisito.id_requisito_programa}`}>
                        <label>{requisito.descripcion}:</label>
                        <span>{`${requisitoValue}${fechaRequisito ? ` (${fechaRequisito})` : ''}`}</span>
                    </div>
                );
            }
        });

        // Agregar requisitos de la modalidad
        requisitosModalidad.forEach((requisito) => {
            const requisitoValue = formData[`requisito_${requisito.id_requisito_modalidad}`];

            if (requisitoValue) {
                requisitoInputs.push(
                    <div key={`requisito_modalidad_${requisito.id_requisito_modalidad}`}>
                        <label>{requisito.descripcion}:</label>
                        <span>{requisitoValue}</span>
                    </div>
                );
            }
        });

        return requisitoInputs;
    };

    // Modificar la función generatePDF para incluir los requisitos dinámicos
    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(12);
        doc.text("DATOS ESTUDIANTES - DATOS INTEGRADOS", 10, 10);
        doc.text(`Número de cuenta: ${formData.num_Cuenta || ''}`, 10, 20);
        doc.text(`Nombre: ${formData.nombre_estudiante || ''}`, 10, 30);
        doc.text(`Apellido Paterno: ${formData.ap_paterno || ''}`, 10, 40);
        doc.text(`Apellido Materno: ${formData.ap_materno || ''}`, 10, 50);
        doc.text(`CURP: ${formData.curp || ''}`, 10, 60);
        doc.text(`Género: ${formData.genero || ''}`, 10, 70);
        doc.text(`Entidad Federativa: ${formData.estado || ''}`, 10, 80);
        doc.text(`Pais: ${formData.pais || ''}`, 10, 90);

        doc.text("DATOS ESCOLARES", 10, 100);
        doc.text(`Bachillerato: ${getBachilleratoNombre(formData.id_bach) || ''}`, 10, 110);
        doc.text(`Fecha Inicio Bachillerato: ${formData.fecha_inicio_bach || ''}`, 10, 120);
        doc.text(`Fecha Fin Bachillerato: ${formData.fecha_fin_bach || ''}`, 10, 130);
        doc.text(`Programa Educativo: ${getProgramaEducativoNombre(formData.id_programa_educativo) || ''}`, 10, 140);
        doc.text(`Título Otorgado: ${getTituloOtorgadoNombre(formData.id_titulo_otorgado) || ''}`, 10, 150);
        doc.text(`Fecha Inicio Licenciatura: ${formData.fecha_inicio_uni || ''}`, 10, 160);
        doc.text(`Fecha Fin Licenciatura: ${formData.fecha_fin_uni || ''}`, 10, 170);
        doc.text(`Estado Pasantía: ${formData.periodo_pasantia || ''}`, 10, 180);
        doc.text(`Modalidad de Titulación: ${getModalidadNombre(formData.id_modalidad) || ''}`, 10, 190);

        // Sección de requisitos
        doc.text("REQUISITOS", 10, 210);
        let yPosition = 220;

        // Agregar requisitos originales
        const requisitosOriginales = [
            { label: "Servicio Social", value: formData.servicio_social },
            { label: "Prácticas Profesionales", value: formData.practicas_profecionales },
            { label: "CEDAI", value: formData.cedai },
        ];

        requisitosOriginales.forEach(({ label, value }) => {
            if (value) {
                doc.text(`${label}: ${value}`, 10, yPosition);
                yPosition += 10;
            }
        });

        // Agregar requisitos del programa
        requisitosPrograma.forEach(requisito => {
            const requisitoValue = formData[`requisito_${requisito.id_requisito_programa}`];
            const fechaRequisito = formData[`fecha_requisito_${requisito.id_requisito_programa}`];
            const texto = `${requisito.descripcion}: ${requisitoValue}${fechaRequisito ? ` (${fechaRequisito})` : ''}`;
            doc.text(texto, 10, yPosition);
            yPosition += 10;
        });

        // Agregar requisitos de la modalidad
        requisitosModalidad.forEach(requisito => {
            const requisitoValue = formData[`requisito_${requisito.id_requisito_modalidad}`];
            const texto = `${requisito.descripcion}: ${requisitoValue || 'No especificado'}`;
            doc.text(texto, 10, yPosition);
            yPosition += 10;
        });

        doc.save('student_data_preview.pdf');
    };



    const handleVerClickRequisitos = () => setMostrarDatosRequisitos(true);

    if (mostrarDatosRequisitos) {
        return <Requisitos citaSeleccionada={citaSeleccionada} />;
    }


    return (
        <div className="student-data-preview">
            <h2>DATOS ESTUDIANTES - DATOS INTEGRADOS</h2>
            <div className="section">
                <h3>DATOS PERSONALES</h3>
                <div className="grid">
                    <input placeholder="Número de cuenta" value={formData.num_Cuenta || ''} readOnly />
                    <input placeholder="Nombre" value={formData.nombre_estudiante || ''} readOnly />
                    <input placeholder="Apellido Paterno" value={formData.ap_paterno || ''} readOnly />
                    <input placeholder="Apellido Materno" value={formData.ap_materno || ''} readOnly />
                    <input placeholder="CURP" value={formData.curp || ''} readOnly />
                    <input placeholder="Género" value={formData.genero || ''} readOnly />
                    <input placeholder="Entidad Federativa" value={formData.estado || ''} readOnly />
                    <input placeholder="Pais" value={formData.pais || ''} readOnly />
                </div>
            </div>
            <div className="section">
                <h3>DATOS ESCOLARES</h3>
                <div className="grid">
                    <input
                        placeholder="Bachillerato"
                        value={getBachilleratoNombre(formData.id_bach) || ''}
                        readOnly
                    />
                    <input placeholder="Fecha Inicio Bachillerato" value={formData.fecha_inicio_bach || ''} readOnly/>
                    <input placeholder="Fecha Fin Bachillerato" value={formData.fecha_fin_bach || ''} readOnly/>
                    <input placeholder="Programa Educativo" value={getProgramaEducativoNombre(formData.id_programa_educativo) || ''} readOnly/>
                    <input placeholder="Título Otorgado" value={getTituloOtorgadoNombre(formData.id_titulo_otorgado) || ''} readOnly/>
                    <input placeholder="Fecha Inicio Licenciatura" value={formData.fecha_inicio_uni || ''} readOnly/>
                    <input placeholder="Fecha Fin Licenciatura" value={formData.fecha_fin_uni || ''} readOnly/>
                    <input placeholder="Estado Pasantía" value={formData.periodo_pasantia || ''} readOnly/>
                    <input placeholder="Modalidad de Titulación" value={getModalidadNombre(formData.id_modalidad) || ''} readOnly/>
                </div>
            </div>
            <div className="section">
                <h3>REQUISITOS</h3>
                <div className="grid">
                    <input placeholder="Servicio Social" value={formData.servicio_social || ''} readOnly/>
                    <input placeholder="Prácticas Profesionales" value={formData.practicas_profecionales || ''} readOnly />
                    <input placeholder="CEDAI" value={formData.cedai || ''} readOnly />
                    {requisitosPrograma.length > 0 ? renderRequisitos() : <p>No hay requisitos disponibles.</p>}
                </div>
            </div>
            <div className="buttons">
                <button onClick={handleVerClickRequisitos} className="edit-button">EDITAR</button>
                <button onClick={generatePDF} className="generate-button">GENERAR BORRADOR</button>
            </div>
        </div>
    );
};

    export default StudentDataPreview;