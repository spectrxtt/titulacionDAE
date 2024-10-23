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
    const [filteredBachilleratos, setFilteredBachilleratos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);

    const [filteredProgramas, setFilteredProgramas] = useState([]);
    const [searchTermProgramas, setSearchTermProgramas] = useState('');
    const [showResultsProgramas, setShowResultsProgramas] = useState(false);

    const [filteredTitulo, setFilteredTitulo] = useState([]);
    const [searchTermTitulo, setSearchTermTitulo] = useState('');
    const [showResultsTitulo, setShowResultsTitulo] = useState(false);

    const [displayName, setDisplayName] = useState('');
    const [programasEducativos, setProgramasEducativos] = useState([]);
    const [titulosOtorgados, settitulosOtorgados] = useState([]);
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
            const [bachResponse, uniResponse, bachilleratosResponse, programasResponse, titulosResponse, modalidadesResponse] = await Promise.all([
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
                fetch('http://127.0.0.1:8000/api/titulo-otorgado', {
                    headers: { 'Authorization': `Bearer ${token}` },
                }),
                fetch('http://127.0.0.1:8000/api/modalidades-titulacion', {
                    headers: { 'Authorization': `Bearer ${token}` },
                })
            ]);

            if (!bachResponse.ok || !uniResponse.ok || !bachilleratosResponse.ok || !programasResponse.ok || !titulosResponse.ok|| !modalidadesResponse.ok) {
                throw new Error('Error fetching data');
            }

            const [bachData, uniData, bachilleratosData, programasData, titulosData, modalidadesData] = await Promise.all([
                bachResponse.json(),
                uniResponse.json(),
                bachilleratosResponse.json(),
                programasResponse.json(),
                titulosResponse.json(),
                modalidadesResponse.json()
            ]);

            const newEstudianteData = { ...bachData, ...uniData };
            updateFormData(newEstudianteData);
            setBachilleratos(bachilleratosData);
            setProgramasEducativos(programasData);
            settitulosOtorgados(titulosData);
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

    // Nuevo useEffect para actualizar el displayName cuando se carga el formData.id_bach
    useEffect(() => {
        if (formData.id_bach && bachilleratos.length > 0) {
            const selectedBach = bachilleratos.find(bach => bach.id_bach === formData.id_bach);
            if (selectedBach) {
                setDisplayName(selectedBach.nombre_bach);
                setSearchTerm(selectedBach.nombre_bach);
            }
        }
    }, [formData.id_bach, bachilleratos]);

    // Modificar el efecto de filtrado para usar searchTerm
    useEffect(() => {
        if (searchTerm) {
            const filtered = bachilleratos.filter(bach =>
                bach.nombre_bach.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredBachilleratos(filtered);
            setShowResults(true);
        } else {
            setFilteredBachilleratos(bachilleratos);
            setShowResults(false);
        }
    }, [searchTerm, bachilleratos]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(true);
        // No actualizamos formData.id_bach aquí, solo cuando se seleccione un bachillerato
    };

    const handleSelectBachillerato = (bach) => {
        updateFormData({ id_bach: bach.id_bach }); // Mantener el ID en formData
        setDisplayName(bach.nombre_bach); // Actualizar el nombre mostrado
        setSearchTerm(bach.nombre_bach);
        setShowResults(false);
    };



    useEffect(() => {
        if (formData.id_programa_educativo && programasEducativos.length > 0) {
            const selectedProgramas = programasEducativos.find(bach => bach.id_programa_educativo === formData.id_programa_educativo);
            if (selectedProgramas) {
                setDisplayName(selectedProgramas.programa_educativo);
                setSearchTermProgramas(selectedProgramas.programa_educativo);
            }
        }
    }, [formData.id_programa_educativo, programasEducativos]);

    // Modificar el efecto de filtrado para usar searchTerm
    useEffect(() => {
        if (searchTermProgramas) {
            const filtered = programasEducativos.filter(programasEducativos =>
                programasEducativos.programa_educativo.toLowerCase().includes(searchTermProgramas.toLowerCase()) // Corregido aquí
            );
            setFilteredProgramas(filtered);
            setShowResultsProgramas(true);
        } else {
            setFilteredProgramas(programasEducativos);
            setShowResultsProgramas(false);
        }
    }, [searchTermProgramas, programasEducativos]);



    const handleSearchChangePrograma = (e) => {
        const value = e.target.value;
        setSearchTermProgramas(value);
        setShowResultsProgramas(true);
        // No actualizamos formData.id_bach aquí, solo cuando se seleccione un bachillerato
    };

    const handleSelectPrograma = (programa) => {
        updateFormData({ id_programa_educativo: programa.id_programa_educativo }); // Mantener el ID en formData
        setDisplayName(programa.programa_educativo); // Actualizar el nombre mostrado
        setSearchTermProgramas(programa.programa_educativo);
        setShowResultsProgramas(false);
    };




    useEffect(() => {
        if (formData.id_titulo_otorgado && titulosOtorgados.length > 0) {
            const selectedTitulos = titulosOtorgados.find(titulos => titulos.id_titulo_otorgado === formData.id_titulo_otorgado);
            if (selectedTitulos) {
                setDisplayName(selectedTitulos.titulo_otorgado);
                setSearchTermTitulo(selectedTitulos.titulo_otorgado);
            }
        }
    }, [formData.id_titulo_otorgado,titulosOtorgados]);

    // Modificar el efecto de filtrado para usar searchTerm
    useEffect(() => {
        if (searchTermTitulo) {
            const filtered = titulosOtorgados.filter(titulosOtorgados =>
                titulosOtorgados.titulo_otorgado.toLowerCase().includes(searchTermTitulo.toLowerCase()) // Corregido aquí
            );
            setFilteredTitulo(filtered);
            setShowResultsTitulo(true);
        } else {
            setFilteredTitulo(titulosOtorgados);
            setShowResultsTitulo(false);
        }
    }, [searchTermTitulo, titulosOtorgados]);



    const handleSearchChangeTitulo = (e) => {
        const value = e.target.value;
        setSearchTermTitulo(value);
        setShowResultsProgramas(true);
        // No actualizamos formData.id_bach aquí, solo cuando se seleccione un bachillerato
    };

    const handleSelectTitulo = (titulo) => {
        updateFormData({ id_titulo_otorgado: titulo.id_titulo_otorgado }); // Mantener el ID en formData
        setDisplayName(titulo.titulo_otorgado); // Actualizar el nombre mostrado
        setSearchTermTitulo(titulo.titulo_otorgado);
        setShowResultsTitulo(false);
    };



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

            // Ajusta la estructura de los datos
            const dataToUpdate = {
                estudianteBach: {
                    fecha_fin_bach: formData.fecha_fin_bach,
                    fecha_inicio_bach: formData.fecha_inicio_bach,
                    id_bach: formData.id_bach,
                    num_Cuenta: citaSeleccionada.num_Cuenta,  // Agrega el número de cuenta aquí
                },
                estudianteUni: {
                    fecha_fin_uni: formData.fecha_fin_uni,
                    fecha_inicio_uni: formData.fecha_inicio_uni,
                    id_modalidad: formData.id_modalidad,
                    periodo_pasantia: formData.periodo_pasantia,
                    id_programa_educativo: formData.id_programa_educativo,
                    id_titulo_otorgado: formData.id_titulo_otorgado,
                    num_Cuenta: citaSeleccionada.num_Cuenta,  // Agrega el número de cuenta aquí también
                }
            };

            // Log los datos que se están enviando
            console.log('Datos a modificar:', JSON.stringify(dataToUpdate, null, 2)); // Formateo para mejor legibilidad

            const response = await fetch(`http://127.0.0.1:8000/api/estudiantes/datos-escolares/${citaSeleccionada.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataToUpdate)
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
    const handleCombinedChange = (e) => {
        handleChange(e);
        handleSearchChange(e);
    };
    const handleCombinedChangePrograma = (e) => {
        handleChange(e);
        handleSearchChangePrograma(e);
    };
    const handleCombinedChangeTitulo = (e) => {
        handleChange(e);
        handleSearchChangeTitulo(e);
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
                            value={searchTerm}
                            onChange={handleCombinedChange}
                            placeholder="Buscar bachillerato..."
                        />
                        <input
                            type="hidden"
                            name="id_bach"
                            value={formData.id_bach || ''}
                        />
                        {showResults && (
                            <ul className="search-results">
                                {filteredBachilleratos.length > 0 ? (
                                    filteredBachilleratos.map((bach) => (
                                        <li
                                            key={bach.id_bach}
                                            onClick={() => handleSelectBachillerato(bach)}
                                        >
                                            {bach.nombre_bach}
                                        </li>
                                    ))
                                ) : (
                                    <li>No se encontraron resultados</li>
                                )}
                            </ul>
                        )}

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
                    <div className="form-group-personales">
                        <label htmlFor="programa">Programa Educativo</label>

                        <input
                            type="text"
                            id="programa"
                            value={searchTermProgramas}
                            onChange={handleCombinedChangePrograma}
                            placeholder="Buscar programa educativo..."
                        />
                        <input
                            type="hidden"
                            name="id_programa_educativo"
                            value={formData.id_programa_educativo || ''}
                        />
                        {showResultsProgramas && (
                            <ul className="search-results">
                                {filteredProgramas.length > 0 ? (
                                    filteredProgramas.map((programa) => (
                                        <li
                                            key={programa.id_programa_educativo}
                                            onClick={() => handleSelectPrograma(programa)}
                                        >
                                            {programa.programa_educativo}
                                        </li>
                                    ))
                                ) : (
                                    <li>No se encontraron resultados</li>
                                )}
                            </ul>
                        )}

                    </div>

                    <div className="form-group">
                        <div className="form-group-personales">
                            <label htmlFor="titulo">Titulo Otorgado</label>

                            <input
                                type="text"
                                id="titulo"
                                value={searchTermTitulo}
                                onChange={handleCombinedChangeTitulo}
                                placeholder="Buscar Titulo otorgado..."
                            />
                            <input
                                type="hidden"
                                name="id_titulo_otorgado"
                                value={formData.id_titulo_otorgado || ''}
                            />
                            {showResultsTitulo && (
                                <ul className="search-results">
                                    {filteredTitulo.length > 0 ? (
                                        filteredTitulo.map((titulo) => (
                                            <li
                                                key={formData.id_titulo_otorgado}
                                                onClick={() => handleSelectTitulo(titulo)}
                                            >
                                                {titulo.titulo_otorgado}
                                            </li>
                                        ))
                                    ) : (
                                        <li>No se encontraron resultados</li>
                                    )}
                                </ul>
                            )}

                        </div>


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