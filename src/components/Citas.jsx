import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import '../styles/CargarCitas.css';
import { useCitas } from './manejarCitas';

const CargarCitas = () => {
    const [file, setFile] = useState(null);
    const [datosTemporales, setDatosTemporales] = useState([]);
    const [fileLoaded, setFileLoaded] = useState(false);
    const { actualizarCitas } = useCitas();
    const [error, setError] = useState(null);
    const [fechaCitas, setFechaCitas] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
        setError(null);
    };

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const wb = XLSX.read(event.target.result, { type: 'array' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];

                    // Extraemos el contenido del archivo como JSON con las cabeceras
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                    // Aquí podríamos mostrar la estructura para depuración
                    console.log("Datos crudos desde el archivo:", data);

                    // Verificar si el archivo tiene suficiente información
                    if (data.length < 3) {
                        throw new Error("El archivo no contiene suficientes datos.");
                    }

                    // Ajustamos el índice para comenzar a leer los datos desde donde inicia realmente
                    // Suponemos que la fecha se encuentra en la segunda fila, primera columna
                    let fechaCitasCell = data[1][0].trim();

                    // Usamos una expresión regular para extraer solo la fecha
                    const regexFecha = /(\d{1,2} de [a-zA-Z]+ de \d{4})/;
                    const matchFecha = fechaCitasCell.match(regexFecha);

                    // Si encontramos la fecha, la extraemos, de lo contrario asignamos un valor por defecto
                    if (matchFecha) {
                        fechaCitasCell = matchFecha[0]; // Extraemos solo la fecha del texto
                    } else {
                        fechaCitasCell = 'Fecha no encontrada'; // Mensaje en caso de que no haya coincidencia
                    }

                    setFechaCitas(fechaCitasCell);

                    // Filtramos las filas que no están vacías y mapeamos las columnas correctas
                    const rows = data.slice(4).filter(row => row.some(cell => cell !== undefined && cell !== null && cell !== ''));

                    // Extraemos columnas específicas según su posición
                    const result = rows.map(row => ({
                        'No.Cuenta': row[1] ? row[1] : 'No data',  // Asegurarnos de extraer correctamente No.Cuenta (columna 2)
                        'Alumno': row[2] ? row[2] : 'No data',     // Columna 3: Alumno
                        'Carrera': row[3] ? row[3] : 'No data',    // Columna 4: Carrera
                        'Fecha': fechaCitasCell
                    }));

                    console.log("Datos procesados:", result);
                    setDatosTemporales(result);
                    setFileLoaded(true);
                    setError(null);
                } catch (err) {
                    console.error("Error al procesar el archivo:", err);
                    setError("Error al procesar el archivo. Asegúrate de que sea un Excel válido.");
                }
            };
            reader.onerror = (err) => {
                console.error("Error al leer el archivo:", err);
                setError("Error al leer el archivo. Por favor, intenta de nuevo.");
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError("Por favor, seleccione un archivo primero.");
        }
    };




    const handleGenerarAsignacion = () => {
        actualizarCitas(datosTemporales);
        alert("Asignación generada con éxito. Los datos han sido cargados en los otros componentes.");
    };

    return (
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
                                <td>{cita['Fecha']}</td>
                                <td>{cita['No.Cuenta']}</td>
                                <td>{cita['Alumno']}</td>
                                <td>{cita['Carrera']}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={handleGenerarAsignacion} className="generate-assignment-button">
                        GENERAR ASIGNACIÓN
                    </button>
                </div>
            )}
            {!fileLoaded && (
                <button onClick={handleUpload} className="upload-button">
                    <Upload />
                    CARGAR ARCHIVO
                </button>
            )}
            {error && <p className="error-message">{error}</p>}
            {datosTemporales.length > 0 && <p className='infoCitas'>Número de citas cargadas: {datosTemporales.length}</p>}
        </div>
    );
};

export default CargarCitas;
