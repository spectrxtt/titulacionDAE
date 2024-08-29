import React, { useState } from 'react';
import '../../styles/StudentDataPreview.css';
import Requisitos from './requisitos';
import jsPDF from 'jspdf';

const StudentDataPreview = () => {
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);

    const handleVerClickRequisitos = () => {
        setMostrarDatosRequisitos(true);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Obtener los datos del preview
        const data = {
            numeroCuenta: document.querySelector('input[placeholder="Número de cuenta"]').value,
            nombre: document.querySelector('input[placeholder="Nombre"]').value,
            apellidoPaterno: document.querySelector('input[placeholder="Apellido Paterno"]').value,
            apellidoMaterno: document.querySelector('input[placeholder="Apellido Materno"]').value,
            genero: document.querySelector('input[placeholder="Género"]').value,
            curp: document.querySelector('input[placeholder="Curp"]').value,
            entidadFederativa: document.querySelector('input[placeholder="Entidad Federativa"]').value,
            bachillerato: document.querySelector('input[placeholder="Bachillerato"]').value,
            fechaInicioBachillerato: document.querySelector('input[placeholder="Fecha de inicio"]').value,
            fechaTerminacionBachillerato: document.querySelector('input[placeholder="Fecha de terminación"]').value,
            programaEducativo: document.querySelector('input[placeholder="Programa educativo"]').value,
            tituloOtorga: document.querySelector('input[placeholder="Título que otorga"]').value,
            modalidadTitulacion: document.querySelector('input[placeholder="Modalidad de titulación"]').value,
            fechaInicioEducacion: document.querySelector('input[placeholder="Fecha de inicio"]').value,
            fechaTerminacionEducacion: document.querySelector('input[placeholder="Fecha de terminación"]').value,
            estadoPasantia: document.querySelector('input[placeholder="Estado de pasantía"]').value,
            resultadoEGEL: document.querySelector('input[placeholder="Resultado de EGEL"]').value,
            fechaAplicacionEGEL: document.querySelector('input[placeholder="Fecha de aplicación"]').value,
            servicioSocial: document.querySelector('input[placeholder="Servicio Social"]').value,
            practicasProfesionales: document.querySelector('input[placeholder="Prácticas Profesionales"]').value,
            resultadoExamenIngles: document.querySelector('input[placeholder="Resultado Examen de inglés"]').value,
            fechaExamenIngles: document.querySelector('input[placeholder="Fecha de Examen de inglés"]').value,
            reciboCEDAI: document.querySelector('input[placeholder="Recibo CEDAI"]').value,
            biblioteca: document.querySelector('input[placeholder="Biblioteca"]').value,
            laboratorio: document.querySelector('input[placeholder="Laboratorio"]').value,
        };

        // Añadir contenido al PDF
        doc.setFontSize(12);
        doc.text("DATOS ESTUDIANTES - DATOS INTEGRADOS", 10, 10);
        doc.text(`Número de cuenta: ${data.numeroCuenta}`, 10, 20);
        doc.text(`Nombre: ${data.nombre}`, 10, 30);
        doc.text(`Apellido Paterno: ${data.apellidoPaterno}`, 10, 40);
        doc.text(`Apellido Materno: ${data.apellidoMaterno}`, 10, 50);
        doc.text(`Género: ${data.genero}`, 10, 60);
        doc.text(`Curp: ${data.curp}`, 10, 70);
        doc.text(`Entidad Federativa: ${data.entidadFederativa}`, 10, 80);
        doc.text(`Bachillerato: ${data.bachillerato}`, 10, 90);
        doc.text(`Fecha de inicio Bachillerato: ${data.fechaInicioBachillerato}`, 10, 100);
        doc.text(`Fecha de terminación Bachillerato: ${data.fechaTerminacionBachillerato}`, 10, 110);
        doc.text(`Programa educativo: ${data.programaEducativo}`, 10, 120);
        doc.text(`Título que otorga: ${data.tituloOtorga}`, 10, 130);
        doc.text(`Modalidad de titulación: ${data.modalidadTitulacion}`, 10, 140);
        doc.text(`Fecha de inicio: ${data.fechaInicioEducacion}`, 10, 150);
        doc.text(`Fecha de terminación: ${data.fechaTerminacionEducacion}`, 10, 160);
        doc.text(`Estado de pasantía: ${data.estadoPasantia}`, 10, 170);
        doc.text(`Resultado de EGEL: ${data.resultadoEGEL}`, 10, 180);
        doc.text(`Fecha de aplicación EGEL: ${data.fechaAplicacionEGEL}`, 10, 190);
        doc.text(`Servicio Social: ${data.servicioSocial}`, 10, 200);
        doc.text(`Prácticas Profesionales: ${data.practicasProfesionales}`, 10, 210);
        doc.text(`Resultado Examen de inglés: ${data.resultadoExamenIngles}`, 10, 220);
        doc.text(`Fecha de Examen de inglés: ${data.fechaExamenIngles}`, 10, 230);
        doc.text(`Recibo CEDAI: ${data.reciboCEDAI}`, 10, 240);
        doc.text(`Biblioteca: ${data.biblioteca}`, 10, 250);
        doc.text(`Laboratorio: ${data.laboratorio}`, 10, 260);

        // Guardar el PDF
        doc.save('student_data_preview.pdf');
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
                <button onClick={generatePDF} className="generate-button">GENERAR BORRADOR</button>
            </div>
        </div>
    );
};

export default StudentDataPreview;
