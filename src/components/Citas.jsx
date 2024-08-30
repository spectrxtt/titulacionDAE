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
                    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                    if (data.length < 2) {
                        throw new Error("El archivo Excel está vacío o no contiene datos válidos.");
                    }

                    const headers = data[0];
                    const rows = data.slice(1);

                    const result = rows.map(row => {
                        let obj = {};
                        row.forEach((value, index) => {
                            if (headers[index] === 'Fecha' && typeof value === 'number') {
                                const date = XLSX.SSF.parse_date_code(value);
                                obj[headers[index]] = `${date.y}-${date.m.toString().padStart(2, '0')}-${date.d.toString().padStart(2, '0')}`;
                            } else {
                                obj[headers[index]] = value;
                            }
                        });
                        return obj;
                    });

                    console.log("Datos procesados:", result);
                    setDatosTemporales(result);
                    setFileLoaded(true);
                    setError(null);
                } catch (err) {
                    console.error("Error al procesar el archivo:", err);
                    setError("Error al procesar el archivo. Asegúrate de que sea un Excel válido con los datos correctos.");
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
                    <h3>Datos Cargados</h3>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th># Cuenta</th>
                            <th>Nombre</th>
                            <th>Apellido Paterno</th>
                            <th>Apellido Materno</th>
                            <th>Fecha</th>
                            <th>Modalidad</th>
                        </tr>
                        </thead>
                        <tbody>
                        {datosTemporales.map((cita, index) => (
                            <tr key={index}>
                                <td>{cita['Numero de cuenta']}</td>
                                <td>{cita['Nombre']}</td>
                                <td>{cita['Apellido Paterno']}</td>
                                <td>{cita['Apellido Materno']}</td>
                                <td>{cita['Fecha']}</td>
                                <td>{cita['Modalidad']}</td>
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
            {datosTemporales.length > 0 && <p>Número de citas cargadas: {datosTemporales.length}</p>}
        </div>
    );
};

export default CargarCitas;
