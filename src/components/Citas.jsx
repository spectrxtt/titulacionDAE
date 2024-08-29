import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import '../styles/CargarCitas.css';

const CargarCitas = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [fileLoaded, setFileLoaded] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const wb = XLSX.read(event.target.result, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
                const headers = data[0];
                const rows = data.slice(1);

                // Transform rows to objects with header keys
                const result = rows.map(row => {
                    let obj = {};
                    row.forEach((value, index) => {
                        obj[headers[index]] = value;
                    });
                    return obj;
                });

                setData(result);
                setFileLoaded(true); // Ocultar el cuadro de carga de archivo
            };
            reader.readAsArrayBuffer(file);
        } else {
            alert("Por favor, seleccione un archivo primero.");
        }
    };

    const handleGenerateAssignment = () => {
        // Aquí iría la lógica para generar la asignación
        console.log("Generar asignación con los datos:", data);
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
                        accept=".xlsx"
                        onChange={handleFileChange}
                        id="file-upload"
                        style={{ display: 'none' }} // Oculta el input file
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
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td>{row['Numero de cuenta']}</td>
                                <td>{row['Nombre']}</td>
                                <td>{row['Apellido Paterno']}</td>
                                <td>{row['Apellido Materno']}</td>
                                <td>{row['Fecha']}</td>
                                <td>{row['Modalidad']}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button onClick={handleGenerateAssignment} className="generate-assignment-button">
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
        </div>
    );
};

export default CargarCitas;
