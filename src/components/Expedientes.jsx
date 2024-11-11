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
        estado: ''
    });


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
            const response = await fetch(`http://10.11.80.188:8000/api/buscar-citas?cuenta=${busqueda.cuenta}&nombre=${busqueda.nombre}&fecha_inicio=${formatDate(fechaInicio)}&fecha_fin=${formatDate(fechaFin)}&estado=${busqueda.estado}`, {
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
            let { fecha_inicio, fecha_fin, cuenta, nombre, estado } = busqueda;

            // Ajuste de fechas
            if (fecha_inicio && !fecha_fin) fecha_fin = fecha_inicio;
            else if (!fecha_inicio && fecha_fin) fecha_inicio = fecha_fin;

            const formatDate = (date) => {
                if (!date) return '';
                const [year, month, day] = date.split('-');
                return `${year}/${month}/${day}`;
            };

            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.188:8000/api/estudiantesCompletos?cuenta=${cuenta}&nombre=${nombre}&fecha_inicio=${formatDate(fecha_inicio)}&fecha_fin=${formatDate(fecha_fin)}&estado=${estado}`, {
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

            Object.entries(data.datos_estudiantes).forEach(([numCuenta, estudiante]) => {
                const citasEstudiante = data.citas.filter(cita => cita.num_Cuenta === parseInt(numCuenta));

                citasEstudiante.forEach(cita => {
                    excelData.push({
                        'Nombre': estudiante.personal_data.nombre_estudiante,
                        'Apellido Paterno': estudiante.personal_data.ap_paterno,
                        'Apellido Materno': estudiante.personal_data.ap_materno,
                        'Titulo Otorgado': estudiante.university_data?.titulo_otorgado || 'N/A',
                        'Modalidad Titulación': estudiante.university_data?.modalidad_titulacion || 'N/A',
                        'CURP': estudiante.personal_data.curp,
                        'Bachillerato': estudiante.bachillerato_data?.nombre_bach || 'N/A',
                        'Fecha Inicio Bachillerato': estudiante.bachillerato_data?.fecha_inicio_bach || 'N/A',
                        'Fecha Fin Bachillerato': estudiante.bachillerato_data?.fecha_fin_bach || 'N/A',
                        'Entidad Bachillerato': estudiante.bachillerato_data?.bach_entidad || 'N/A',
                        'Programa Educativo': estudiante.university_data?.programa_educativo || 'N/A',
                        'Fecha Inicio Universidad': estudiante.university_data?.fecha_inicio_uni || 'N/A',
                        'Fecha Fin Universidad': estudiante.university_data?.fecha_fin_uni || 'N/A',
                        'Estado': estudiante.personal_data.estado,
                        'Número de Cuenta': numCuenta,
                        'Género': estudiante.personal_data.genero,
                        'País': estudiante.personal_data.pais,
                        'Periodo Pasantía': estudiante.university_data?.periodo_pasantia || 'N/A',
                        'Fecha Cita': cita.fecha,
                        'Estado Cita': cita.estado_cita,
                        'Observaciones': cita.observaciones || 'N/A',
                        'Integrador': cita.nombre_usuario || 'N/A'
                    });
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

            // Generar y descargar el archivo
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
            estado: ''
        });
        fetchCitas(); // Volver a cargar las citas por defecto (solo estado "Integrado")
    };

    const fetchCitas = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://10.11.80.188:8000/api/citas', {
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

            // Filtrar solo citas con estado "Integrado"
            const citasIntegradas = data.filter(cita => cita.estado_cita === 'Integrado');

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
                        <th>Integrador</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {citas.length > 0 ? (
                        citas.map((cita, index) => (
                            <tr key={index}>
                                <td>{cita.num_Cuenta || 'N/A'}</td>
                                <td>{cita.nombre || 'N/A'}</td>
                                <td>{cita.programa_educativo || 'N/A'}</td>
                                <td>{cita.fecha || 'N/A'}</td>
                                <td>{cita.estado_cita || 'N/A'}</td>
                                <td>{cita.observaciones || 'N/A'}</td>
                                <td>{cita.usuario?.nombre_usuario || 'N/A'}</td> {/* Asegúrate que 'usuario' está presente */}
                                <td>
                                    <button className="button" onClick={() => handleVerClick(cita)}>
                                        VER
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{
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