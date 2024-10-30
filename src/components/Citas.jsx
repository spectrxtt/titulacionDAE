import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import UsuariosActivosChecklist from './usuariosActivos';
import '../styles/CargarCitas.css';

const formatDate = (fechaTexto) => {
    const meses = {
        'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
        'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
        'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };

    const regex = /(\d{1,2}) de ([a-zA-Z]+) de (\d{4})/;
    const match = fechaTexto.match(regex);

    if (match) {
        const dia = match[1].padStart(2, '0');
        const mes = meses[match[2].toLowerCase()];
        const año = match[3];
        return `${año}/${mes}/${dia}`;
    }

    return null;
};

const CargarCitas = () => {
    const [file, setFile] = useState(null);
    const [datosTemporales, setDatosTemporales] = useState([]);
    const [fileLoaded, setFileLoaded] = useState(false);
    const [fechaCitas, setFechaCitas] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError('');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = XLSX.read(event.target.result, { type: 'array' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                let fechaCitasCell = data[1][0].trim();
                const regexFecha = /(\d{1,2} de [a-zA-Z]+) de (\d{4})/;
                const matchFecha = fechaCitasCell.match(regexFecha);
                const fechaFormateada = matchFecha ? formatDate(matchFecha[0]) : 'Fecha no encontrada';
                setFechaCitas(fechaFormateada);

                const rows = data.slice(4).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));
                const result = rows.map(row => {
                    const nombreCompleto = row[2] || 'No data';
                    const [ap_paterno, ap_materno] = nombreCompleto.split(' ');

                    return {
                        fecha: fechaFormateada,
                        num_Cuenta: row[1] ? row[1].toString() : 'No data',
                        nombre: nombreCompleto,
                        ap_paterno: ap_paterno || '',
                        ap_materno: ap_materno || '',
                        carrera: row[3] || 'No data',
                        observaciones: 'Ninguna',
                        estado_cita: 'pendiente'
                    };
                });

                setDatosTemporales(result);
                setFileLoaded(true);
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Por favor, selecciona un archivo válido.');
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleConfirmarAsignacion = async (usuarios) => {
        try {
            const dataToSend = {
                citas: datosTemporales.map(cita => {
                    const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];

                    return {
                        fecha: cita.fecha,
                        num_Cuenta: cita.num_Cuenta,
                        nombre: cita.nombre.toUpperCase(),
                        carrera: cita.carrera,
                        observaciones: cita.observaciones,
                        estado_cita: cita.estado_cita,
                        id_usuario: usuarioAleatorio.id_usuario
                    };
                }),
                estudiantes: datosTemporales.map(cita => {
                    const nombreCompleto = cita.nombre.trim();
                    const nombreParts = nombreCompleto.split(' ');

                    const ap_paterno = nombreParts.length > 0 ? capitalizeFirstLetter(nombreParts[0]) : '';
                    const ap_materno = nombreParts.length > 1 ? capitalizeFirstLetter(nombreParts[1]) : '';
                    const nombre_estudiante = nombreParts.slice(2).map(capitalizeFirstLetter).join(' ');

                    return {
                        num_Cuenta: cita.num_Cuenta,
                        nombre_estudiante: nombre_estudiante.trim(),
                        ap_paterno: ap_paterno.trim(),
                        ap_materno: ap_materno.trim()
                    };
                }),

                estudiantesBach: datosTemporales.map(cita => {
                    return {
                        num_Cuenta: cita.num_Cuenta,
                    };
                }),

                estudiantesUni: datosTemporales.map(cita => {
                    return {
                        num_Cuenta: cita.num_Cuenta,
                    };
                }),

                requisitosObligatorios: datosTemporales.map(cita => {
                    return {
                        num_Cuenta: cita.num_Cuenta,
                    };
                }),

                requisitosPrograma: datosTemporales.map(cita => {
                    return {
                        num_Cuenta: cita.num_Cuenta,
                    };
                }),

                requisitosModalidad: datosTemporales.map(cita => {
                    return {
                        num_Cuenta: cita.num_Cuenta,
                    };
                })
            };

            console.log('Datos a enviar:', JSON.stringify(dataToSend, null, 2));
            const token = localStorage.getItem('token');
            const response = await fetch('http://10.11.80.237:8000/api/cargar-citas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,},
                body: JSON.stringify(dataToSend)
            });

            const responseData = await response.json();
            console.log('Respuesta del servidor:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'Error al cargar citas');
            }

            setSuccess('Citas cargadas con éxito');
            setDatosTemporales([]);
            setFileLoaded(false);
            setError('');
        } catch (error) {
            console.error('Error detallado:', error);
            setError(`Error al cargar citas: ${error.message}`);
        }
    };

    return (
        <div className="cargar-citas-con-usuarios">
            <div className="cargar-citas">
                <h2>CARGAR CITAS</h2>
                {!fileLoaded ? (
                    <div
                        className="drop-area"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            id="file-upload"
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-upload">
                            <Upload />
                            <p>
                                Seleccione o arrastre el archivo .xlsx para cargar las citas
                            </p>
                        </label>
                        {file && <p className="file-selected">Archivo seleccionado: {file.name}</p>}
                    </div>
                ) : (
                    <div>
                        <h3 className="datosCargados">Datos Cargados</h3>
                        <p>Fecha de Citas: {fechaCitas}</p>
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>No.Cuenta</th>
                                <th>Alumno</th>
                                <th>Carrera</th>
                            </tr>
                            </thead>
                            <tbody>
                            {datosTemporales.map((cita, index) => (
                                <tr key={index}>
                                    <td>{cita.fecha}</td>
                                    <td>{cita.num_Cuenta}</td>
                                    <td>{cita.nombre}</td>
                                    <td>{cita.carrera}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <UsuariosActivosChecklist onConfirmar={handleConfirmarAsignacion} />
                        {error && <p className="error-message">{error}</p>}
                        {success && <p className="success-message">{success}</p>}
                    </div>
                )}
                {!fileLoaded && (
                    <button onClick={handleUpload} className="upload-button">
                        <Upload />
                        CARGAR ARCHIVO
                    </button>
                )}
                {datosTemporales.length > 0 && <p className='infoCitas'>Número de citas cargadas: {datosTemporales.length}</p>}
            </div>
        </div>
    );
};

export default CargarCitas;
