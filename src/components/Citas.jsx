import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import '../styles/CargarCitas.css';

const CargarCitas = () => {
    const [file, setFile] = useState(null);

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
            // Aquí iría la lógica para procesar el archivo
            console.log("Archivo cargado:", file.name);
        } else {
            alert("Por favor, seleccione un archivo primero.");
        }
    };

    return (
        <div className="cargar-citas">
            <h2>CARGAR CITAS</h2>
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
                />
                <label htmlFor="file-upload">
                    <Upload />
                    <p>
                        Seleccione o arrastre el archivo .xlsx para cargar las citas
                    </p>
                </label>
                {file && <p className="file-selected">Archivo seleccionado: {file.name}</p>}
            </div>
            <button onClick={handleUpload} className="upload-button">
                <Upload />
                CARGAR ARCHIVO
            </button>
        </div>
    );
};

export default CargarCitas;