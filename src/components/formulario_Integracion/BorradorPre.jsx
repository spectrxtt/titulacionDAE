import React, {useState} from 'react';
import '../../styles/StudentDataPreview.css';
import Requisitos from './requisitos';

const StudentDataPreview = () => {

    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);

    const handleVerClickRequisitos = () => {
        setMostrarDatosRequisitos(true);
    };

    if (mostrarDatosRequisitos) {
        return <Requisitos />;
    }
    return (
        <div className="student-data-preview">
            <h2>DATOS ESTUDIANTES-DATOS INTEGRADOS</h2>
            <div className="section">
                <h3>DATOS PERSONALES</h3>
                <div className="grid">
                    <input placeholder="Número de cuenta" readOnly />
                    <input placeholder="Nombre" readOnly />
                    <input placeholder="Apellido Paterno" readOnly />
                    <input placeholder="Apellido Materno" readOnly />
                    <input placeholder="Género" readOnly />
                    <input placeholder="Curp" readOnly />
                    <input placeholder="Entidad Federativa" readOnly />
                </div>
            </div>

            <div className="section">
                <h3>BACHILLERATO</h3>
                <div className="grid">
                    <input placeholder="Bachillerato" readOnly />
                    <input placeholder="Fecha de inicio" readOnly />
                    <input placeholder="Fecha de terminación" readOnly />
                </div>
            </div>

            <div className="section">
                <h3>DATOS ESCOLARES</h3>
                <div className="grid">
                    <input placeholder="Programa educativo" readOnly />
                    <input placeholder="Título que otorga" readOnly />
                    <input placeholder="Modalidad de titulación" readOnly />
                    <input placeholder="Fecha de inicio" readOnly />
                    <input placeholder="Fecha de terminación" readOnly />
                    <input placeholder="Estado de pasantía" readOnly />
                    <input placeholder="Resultado de EGEL" readOnly />
                    <input placeholder="Fecha de aplicación" readOnly />
                    <input placeholder="Servicio Social" readOnly />
                    <input placeholder="Prácticas Profesionales" readOnly />
                    <input placeholder="Resultado Examen de inglés" readOnly />
                    <input placeholder="Fecha de Examen de inglés" readOnly />
                    <input placeholder="Recibo CEDAI" readOnly />
                    <input placeholder="Biblioteca" readOnly />
                    <input placeholder="Laboratorio" readOnly />
                </div>
            </div>

            <div className="buttons">
                <button onClick={handleVerClickRequisitos} className="edit-button">EDITAR</button>
                <button className="generate-button">GENERAR BORRADOR</button>
            </div>
        </div>
    );
};

export default StudentDataPreview;