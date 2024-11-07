import React, { useState, useEffect, useRef } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import Integracion from '../Integracion';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";
import ClipLoader from "react-spinners/ClipLoader";
import entidadesFederativas from '../../data/entidadesFederativas.json';
import paises from '../../data/paises.json';

const DatosPersonales = ({ citaSeleccionada }) => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
        const [mostrarIntegracion, setMostrarIntegracion] = useState(false);
        const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
        const { formData, updateFormData } = useFormData();
        const [estudianteData, setEstudianteData] = useState(null);
        const [loading, setLoading] = useState(true); // Nuevo estado para control de carga
        const formUpdated = useRef(false); // Para evitar bucles de actualización

        const [entidadInputValue, setEntidadInputValue] = useState('');
        const [filteredEntidades, setFilteredEntidades] = useState([]);
        const [showEntidadSuggestions, setShowEntidadSuggestions] = useState(false);
        const entidadInputRef = useRef(null);

        const [paisInputValue, setPaisInputValue] = useState('');
        const [filteredPaises, setFilteredPaises] = useState([]);
        const [showPaisSuggestions, setShowPaisSuggestions] = useState(false);
        const paisInputRef = useRef(null);

    const actualizarDatosEstudiante = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.137.1:8000/api/estudiantes/${formData.num_Cuenta}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar datos del estudiante');
            }

            console.log('Datos actualizados correctamente');
        } catch (error) {
            console.error('Error:', error);
        }
    };

        // Función para obtener los datos del estudiante
    useEffect(() => {
        const fetchEstudianteData = async () => {
            if (!citaSeleccionada || !citaSeleccionada.num_Cuenta) {
                console.log('No hay número de cuenta disponible');
                setLoading(false); // Detenemos la carga si no hay cita seleccionada
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://192.168.137.1:8000/api/estudiantes/${citaSeleccionada.num_Cuenta}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener datos del estudiante');
                }

                const data = await response.json();
                setEstudianteData(data);
                setLoading(false); // Los datos han sido cargados
            } catch (error) {
                console.error('Error:', error);
                setLoading(false); // En caso de error, detener la animación de carga
            }
        };

        fetchEstudianteData();
    }, [citaSeleccionada]); // Solo se ejecuta cuando citaSeleccionada cambia

    useEffect(() => {
        if (estudianteData && Object.keys(estudianteData).length > 0 && !formUpdated.current) {
            const updatedData = {
                ...estudianteData,
                pais: estudianteData.pais || 'México',
            };
            updateFormData(updatedData);
            setEntidadInputValue(updatedData.estado || '');
            setPaisInputValue(updatedData.pais || 'México');
            formUpdated.current = true;
        }
    }, [estudianteData, updateFormData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (entidadInputRef.current && !entidadInputRef.current.contains(event.target)) {
                setShowEntidadSuggestions(false);
            }
            if (paisInputRef.current && !paisInputRef.current.contains(event.target)) {
                setShowPaisSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEntidadInputChange = (e) => {
        const value = e.target.value;
        setEntidadInputValue(value);  // Mantenemos el valor local para el buscador
        updateFormData({ estado: value });  // También actualizamos formData

        const filtered = entidadesFederativas.filter(entidad =>
            entidad.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredEntidades(filtered);
        setShowEntidadSuggestions(true);
    };

    const handlePaisInputChange = (e) => {
        const value = e.target.value;
        setPaisInputValue(value);  // Mantenemos el valor local para el buscador
        updateFormData({ pais: value });  // También actualizamos formData

        const filtered = paises.filter(pais =>
            pais.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPaises(filtered);
        setShowPaisSuggestions(true);
    };

    const handleEntidadSelect = (entidad) => {
        setEntidadInputValue(entidad);  // Actualizamos el valor local
        updateFormData({ estado: entidad });  // Sincronizamos con formData
        setShowEntidadSuggestions(false);  // Ocultamos las sugerencias
    };

    const handlePaisSelect = (pais) => {
        setPaisInputValue(pais);  // Actualizamos el valor local
        updateFormData({ pais: pais });  // Sincronizamos con formData
        setShowPaisSuggestions(false);  // Ocultamos las sugerencias
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
    };

    // Manejadores para los botones de ver datos escolares y generar reporte
    const handleVerClick = async (e) => {
        e.preventDefault();
        await actualizarDatosEstudiante();
        setMostrarDatosEscolares(true);
    };

    const handleVerClickIntegracion = (e) => {
        e.preventDefault();
        setMostrarIntegracion(true);
    };

    const handleGenerarReporteClick = (e) => {
        e.preventDefault();
        setMostrarGenerarReporte(true);
    };


    if (mostrarDatosEscolares) {
        return <DatosEscolares citaSeleccionada={citaSeleccionada} />;
    }
    if (mostrarIntegracion) {
        return <Integracion />;
    }

    if (mostrarGenerarReporte) {
        return <GenerarReporte citaSeleccionada={citaSeleccionada}/>;
    }

    // Mostrar el spinner mientras los datos están cargando
    if (loading) {
        return (
            <div className="spinner-container">
                <ClipLoader color={"#841816"} loading={loading} size={50} />
            </div>
        );
    }

    // Renderizado del formulario cuando los datos han sido cargados
    return (
        <div className="personales">
            <div className="boton_generarReporte">
                <button onClick={handleGenerarReporteClick}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </button>
            </div>
            <h2>Datos Personales</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="numCuenta">Numero de cuenta</label>
                    <input
                        type="text"
                        id="numCuenta"
                        name="num_Cuenta"
                        value={formData.num_Cuenta || ''}
                        onChange={handleChange}
                        readOnly
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre_estudiante"
                            value={formData.nombre_estudiante || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <input
                            type="text"
                            id="apellidoPaterno"
                            name="ap_paterno"
                            value={formData.ap_paterno || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <input
                            type="text"
                            id="apellidoMaterno"
                            name="ap_materno"
                            value={formData.ap_materno || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="curp">Curp</label>
                        <input
                            type="text"
                            id="curp"
                            name="curp"
                            value={formData.curp || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Genero">Género</label>
                        <select
                            id="Genero"
                            name="genero"
                            value={formData.genero || ''}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-groupB form-group" ref={entidadInputRef}>
                        <label htmlFor="EntidadFederativa">Entidad Federativa</label>
                        <input
                            type="text"
                            id="EntidadFederativa"
                            name="estado"
                            value={entidadInputValue || ''}  // Seguimos usando el estado local para mostrar el valor
                            onChange={handleEntidadInputChange}  // Manejamos el buscador
                            placeholder="Escribe para buscar..."
                        />
                        {showEntidadSuggestions && filteredEntidades.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredEntidades.map((entidad, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleEntidadSelect(entidad)}  // Selección de la entidad
                                    >
                                        {entidad}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-groupB form-group" ref={paisInputRef}>
                        <label htmlFor="Pais">País</label>
                        <input
                            type="text"
                            id="Pais"
                            name="pais"
                            value={paisInputValue || ''}  // Seguimos usando el estado local para mostrar el valor
                            onChange={handlePaisInputChange}  // Manejamos el buscador
                            placeholder="Escribe para buscar..."
                        />
                        {showPaisSuggestions && filteredPaises.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredPaises.map((pais, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handlePaisSelect(pais)}  // Selección del país
                                    >
                                        {pais}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>


                <div className="boton_integracionS">
                    <button onClick={handleVerClickIntegracion}>
                        Regresar a Citas
                    </button>
                    <button onClick={handleVerClick}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DatosPersonales;