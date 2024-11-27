import React, { useState, useEffect } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';
import Bitacora from './bitacora';
import * as XLSX from 'xlsx';

const Expedientes = () => {
    const [citas, setCitas] = useState([]);
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [mostrarBitacora, setMostrarBitacora] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState({
        cuenta: '',
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: '',
        observaciones: '' // Nuevo campo
    });
    const [totalCitas, setTotalCitas] = useState(0);
    const formatDateS = (fecha) => {
        if (!fecha) return 'N/A';
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) return 'N/A';

        // Ajustar la fecha para compensar la diferencia de zona horaria
        const offsetMs = fechaObj.getTimezoneOffset() * 60 * 1000;
        const adjustedDate = new Date(fechaObj.getTime() + offsetMs);

        const dia = adjustedDate.getDate().toString().padStart(2, '0');
        const mes = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
        const año = adjustedDate.getFullYear();
        return `${dia}-${mes}-${año}`;
    };

// Actualiza el total de citas cuando las citas cambian
    useEffect(() => {
        setTotalCitas(citas.length); // Asume que `citas` es el array de citas filtradas
    }, [citas]);


    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
    };

    const handleBitacoraClick = () => {
        setMostrarBitacora(true);
    };

    const handleBusquedaChange = (e) => {
        setBusqueda({ ...busqueda, [e.target.name]: e.target.value });
    };

    const handleBuscar = async () => {
        try {
            let fechaInicio = busqueda.fecha_inicio;
            let fechaFin = busqueda.fecha_fin;

            if (fechaInicio && !fechaFin) {
                fechaFin = fechaInicio;
            } else if (!fechaInicio && fechaFin) {
                fechaInicio = fechaFin;
            }

            const formatDate = (date) => {
                if (!date) return '';
                const [year, month, day] = date.split('-');
                return `${year}/${month}/${day}`;
            };

            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.111:8000/api/buscar-citas?cuenta=${busqueda.cuenta}&nombre=${busqueda.nombre}&fecha_inicio=${formatDate(fechaInicio)}&fecha_fin=${formatDate(fechaFin)}&estado=${busqueda.estado}&observaciones=${busqueda.observaciones}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.status === 404) {
                setCitas([]);
                setError(data.message || 'No se encontraron citas con los filtros especificados');
            } else if (!response.ok) {
                throw new Error(data.error || 'Error al buscar citas');
            } else {
                setCitas(data);
                setError(null);
            }
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            setError(error.message);
            setCitas([]);
        }
    };

    const handleExportToExcel = async () => {
        try {
            let fechaInicio = busqueda.fecha_inicio;
            let fechaFin = busqueda.fecha_fin;

            if (fechaInicio && !fechaFin) {
                fechaFin = fechaInicio;
            } else if (!fechaInicio && fechaFin) {
                fechaInicio = fechaFin;
            }

            const formatDate = (date) => {
                if (!date) return '';
                const [year, month, day] = date.split('-');
                return `${year}/${month}/${day}`;
            };

            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.111:8000/api/estudiantesCompletos?cuenta=${busqueda.cuenta}&nombre=${busqueda.nombre}&fecha_inicio=${formatDate(fechaInicio)}&fecha_fin=${formatDate(fechaFin)}&estado=${busqueda.estado}&observaciones=${busqueda.observaciones}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error al obtener los datos');
            }

            const data = await response.json();
            console.log("Datos obtenidos de la API:", data);

            if (!data || !data.datos_estudiantes || !data.citas) {
                throw new Error('No se obtuvieron datos suficientes para exportar a Excel');
            }

            const excelData = [];
            let citaIndex = 1;

            // Procesamos los datos
            Object.entries(data.datos_estudiantes).forEach(([numCuenta, estudiante]) => {
                // Comparar los num_Cuenta directamente como cadenas
                const citasEstudiante = data.citas.filter(cita => cita.num_Cuenta === numCuenta);

                citasEstudiante.forEach(cita => {
                    excelData.push({
                        'Número de Cita': citaIndex,
                        'Número de Cuenta': numCuenta,
                        'nombre': `${estudiante.personal_data.nombre_estudiante || ''} ${estudiante.personal_data.ap_paterno || ''} ${estudiante.personal_data.ap_materno || ''}`,
                        'tituloque se otorga': estudiante.university_data?.titulo_otorgado || 'N/A',
                        'CURP': estudiante.personal_data.curp,
                        'bachillerato': estudiante.bachillerato_data?.nombre_bach || 'N/A',
                        'institucionProcedenciaAnioInicio': formatDateS(estudiante.bachillerato_data?.fecha_inicio_bach),
                        'institucionProcedenciaAnioTermino': formatDateS(estudiante.bachillerato_data?.fecha_fin_bach),
                        'institucionProcedenciaEntidadFederativa': estudiante.bachillerato_data?.bach_entidad || 'N/A',
                        'carrera': estudiante.university_data?.programa_educativo || 'N/A',
                        'anioInicio': formatDateS(estudiante.university_data?.fecha_inicio_uni || 'N/A'),
                        'anioTermino': formatDateS(estudiante.university_data?.fecha_fin_uni || 'N/A'),
                        'promedio': null,
                        'promedioletra': null,
                        'expedicionModalidadTitulacion': estudiante.university_data?.modalidad_titulacion || 'N/A',
                        'Género': estudiante.personal_data.genero,
                        'País': estudiante.personal_data.pais,
                        'Periodo Pasantía': formatDateS(estudiante.university_data?.periodo_pasantia || 'N/A'),
                        'Fecha Cita': formatDateS(cita.fecha),
                        'Estado Cita': cita.estado_cita,
                        'Observaciones': cita.observaciones || 'N/A',
                        'Integrador': cita.nombre_usuario || 'N/A'
                    });
                    citaIndex++;
                });
            });

            if (excelData.length === 0) {
                throw new Error("No se generaron datos para el archivo Excel.");
            }

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Estudiantes y Citas');

            // Ajuste de ancho de columnas
            const colWidths = Object.keys(excelData[0] || {}).map(key => ({
                wch: Math.max(10, key.length + 5)
            }));
            worksheet['!cols'] = colWidths;

            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(workbook, `Reporte_Estudiantes_${fecha}.xlsx`);

        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            setError(error.message);
        }
    };

    const handleLimpiarBusqueda = () => {
        setBusqueda({
            cuenta: '',
            nombre: '',
            fecha_inicio: '',
            fecha_fin: '',
            estado: '',
            observaciones: '' // Nuevo campo
        });
        fetchCitas(); // Volver a cargar las citas por defecto (solo estado "Integrado")
    };

    const fetchCitas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://10.11.80.111:8000/api/citasExpedientes', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al cargar citas');
            }

            const data = await response.json();

            // Filtrar citas con estado "Integrado" o "Rechazado"
            const citasIntegradas = data.filter(cita => cita.estado_cita === 'Integrado' || cita.estado_cita === 'Rechazado');

            setCitas(citasIntegradas);
        } catch (error) {
            console.error('Error al cargar citas:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitas();
    }, []);

    if (loading) {
        return <div>Cargando citas...</div>;
    }

    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
    }

    if (mostrarBitacora) {
        return <Bitacora onClose={() => setMostrarBitacora(false)} />;
    }

    return (
        <div className="integracion-wrapper">
            <div className="buscador">
                {/* Account Number Filter */}
                <input
                    type="text"
                    name="cuenta"
                    value={busqueda.cuenta}
                    onChange={handleBusquedaChange}
                    placeholder="Número de Cuenta"
                />

                {/* Full Name Filter */}
                <input
                    type="text"
                    name="nombre"
                    value={busqueda.nombre}
                    onChange={handleBusquedaChange}
                    placeholder="Nombre Completo"
                />
                <input
                    type="text"
                    name="observaciones"
                    value={busqueda.observaciones}
                    onChange={handleBusquedaChange}
                    placeholder="Observaciones"
                />

                {/* Start Date Filter */}
                <input
                    type="date"
                    name="fecha_inicio"
                    value={busqueda.fecha_inicio || ''}
                    onChange={handleBusquedaChange}
                    placeholder="Fecha de Inicio"
                />

                {/* End Date Filter */}
                <input
                    type="date"
                    name="fecha_fin"
                    value={busqueda.fecha_fin || ''}
                    onChange={handleBusquedaChange}
                    placeholder="Fecha Final"
                />


                {/* Status Filter */}
                <select
                    name="estado"
                    value={busqueda.estado}
                    onChange={handleBusquedaChange}
                >
                    <option value="">Seleccione un estado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="Enviado, pendiente de validar">Enviado, pendiente de validar</option>
                    <option value="Integrado">Integrado</option>
                    <option value="Dato Faltante">Dato Faltante</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Corrección">Corrección</option>
                    <option value="Atendiendo Corrección">Atendiendo Corrección</option>
                    <option value="Corrección Atendida">Corrección Atendida</option>
                </select>

                {/* Search and Clear Buttons */}
                <button onClick={handleBuscar}>Buscar</button>
                <button onClick={handleLimpiarBusqueda}>Limpiar</button>
                <button
                    onClick={handleExportToExcel}
                    className="button"
                    style={{
                        backgroundColor: '#1d4ed8', // Color azul para distinguirlo
                        color: 'white',
                        marginLeft: '10px'
                    }}
                >
                    Exportar a Excel
                </button>
            </div>
            {/* Display the total number of appointments */}
            <div className="total-citas">
                Total de citas mostradas: {citas.length}
            </div>

            <div className="containerExpedientes">
                <h3>EXPEDIENTES INTEGRADOS</h3>
                <table className="table">
                    <thead>
                    <tr>
                        <th># Cuenta</th>
                        <th>Nombre</th>
                        <th>Programa Educativo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Modalidad Titulación</th>
                        <th>Acciones</th>
                        <th>Integrador</th>

                        {/* Nueva columna */}

                    </tr>
                    </thead>
                    <tbody>
                    {citas.length > 0 ? (
                        citas.map((cita, index) => (
                            <tr key={index}>
                                <td>{cita.num_Cuenta || 'N/A'}</td>
                                <td>{cita.nombre || 'N/A'}</td>
                                <td>{cita.programa_educativo || 'N/A'}</td>
                                <td>{formatDateS(cita.fecha || 'N/A')}</td>
                                <td>{cita.estado_cita || 'N/A' }</td>
                                <td>{cita.observaciones || 'N/A'}</td>
                                <td>{cita.estudiante?.modalidad?.modalidad_titulacion || 'N/A'}</td>
                                <td>
                                    <button className="button" onClick={() => handleVerClick(cita)}>
                                        VER
                                    </button>
                                </td>
                                <td>{cita.usuario?.nombre_usuario || 'N/A'}</td>
                                {/* Nueva celda para modalidad titulacion */}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" style={{
                                textAlign: 'center',
                                padding: '1rem',
                                color: '#dc2626' // Color rojo para el error
                            }}>
                                {error || 'No hay citas disponibles'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

        </div>
    );

};

export default Expedientes;