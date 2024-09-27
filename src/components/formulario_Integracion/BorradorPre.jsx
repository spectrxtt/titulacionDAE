import React, { useState, useEffect } from 'react';
import '../../styles/StudentDataPreview.css';
import Requisitos from './requisitos';
import jsPDF from 'jspdf';
import { useFormData } from './integracionDatos';
import datosPersonales from "../../pruebas/datosPersonales";

const StudentDataPreview = ({ citaSeleccionada }) => {
    const [mostrarDatosRequisitos, setMostrarDatosRequisitos] = useState(false);
    const { formData, updateFormData } = useFormData();

    useEffect(() => {
        if (citaSeleccionada) {
            const numeroCuenta = citaSeleccionada['No.Cuenta'];
            const datoAdicional = datosPersonales.find(d => d.numCuenta === numeroCuenta);
            updateFormData({
                ...citaSeleccionada,
                ...datoAdicional,
            });
        }
    }, [citaSeleccionada, updateFormData]);

    const handleVerClickRequisitos = () => setMostrarDatosRequisitos(true);

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(12);
        doc.text("DATOS ESTUDIANTES - DATOS INTEGRADOS", 10, 10);
        doc.text(`Número de cuenta: ${formData.NoCuenta || ''}`, 10, 20);
        doc.text(`Nombre: ${formData.nombre || ''}`, 10, 30);
        doc.text(`Apellido Paterno: ${formData.apellidoPaterno || ''}`, 10, 40);
        doc.text(`Apellido Materno: ${formData.apellidoMaterno || ''}`, 10, 50);
        doc.text(`CURP: ${formData.curp || ''}`, 10, 60);
        doc.text(`Género: ${formData.Genero || ''}`, 10, 70);
        doc.text(`Entidad Federativa: ${formData.EntidadFederativa || ''}`, 10, 80);

        doc.text("DATOS ESCOLARES", 10, 100);
        doc.text(`Bachillerato: ${formData.bachillerato || ''}`, 10, 110);
        doc.text(`Fecha Inicio Bachillerato: ${formData.fechaInBach || ''}`, 10, 120);
        doc.text(`Fecha Fin Bachillerato: ${formData.fechaFinBach || ''}`, 10, 130);
        doc.text(`Programa Educativo: ${formData.programaEducativo || ''}`, 10, 140);
        doc.text(`Fecha Inicio Licenciatura: ${formData.fechaInLic || ''}`, 10, 150);
        doc.text(`Fecha Fin Licenciatura: ${formData.fechaFinLic || ''}`, 10, 160);
        doc.text(`Estado Pasantía: ${formData.pasantia || ''}`, 10, 170);
        doc.text(`Modalidad de Titulación: ${formData.modalidad || ''}`, 10, 180);

        doc.text("REQUISITOS", 10, 200);
        let yPosition = 210;

        // Requisitos originales
        const requisitosOriginales = [
            { label: "Resultado EGEL", value: formData.Egel },
            { label: "Fecha de Aplicación EGEL", value: formData.fechaEgel },
            { label: "Servicio Social", value: formData.servicioSocial },
            { label: "Prácticas Profesionales", value: formData.practicasProfesionales },
            { label: "Examen de Inglés", value: formData.examenIngles },
            { label: "Fecha Aplicación Inglés", value: formData.fechaInLic },
            { label: "Biblioteca", value: formData.Biblioteca },
            { label: "CEDAI", value: formData.cedai },
            { label: "Laboratorio", value: formData.Laboratorio }
        ];

        requisitosOriginales.forEach(({ label, value }) => {
            if (value) {
                doc.text(`${label}: ${value}`, 10, yPosition);
                yPosition += 10;
            }
        });

        // Nuevos campos de requisitos personalizados
        for (let i = 1; i <= 6; i++) {
            const requisitoValue = formData[`requisito${i}`];
            const requisitoStatus = formData[`requisito${i}Status`];
            if (requisitoValue) {
                doc.text(`${requisitoValue}: ${requisitoStatus || 'No especificado'}`, 10, yPosition);
                yPosition += 10;
            }
        }

        doc.save('student_data_preview.pdf');
    };

    if (mostrarDatosRequisitos) return <Requisitos />;
    const renderRequisitos = () => {
        const requisitoInputs = [];
        for (let i = 1; i <= 6; i++) {
            const requisitoValue = formData[`requisito${i}`];
            const requisitoStatus = formData[`requisito${i}Status`];
            if (requisitoValue) {
                requisitoInputs.push(
                    <input
                        key={`requisito${i}`}
                        placeholder={`Requisito ${i}`}
                        value={`${requisitoValue}: ${requisitoStatus || 'No especificado'}`}
                        readOnly
                    />
                );
            }
        }
        return requisitoInputs;
    };

    return (
        <div className="student-data-preview">
            <h2>DATOS ESTUDIANTES - DATOS INTEGRADOS</h2>
            <div className="section">
                <h3>DATOS PERSONALES</h3>
                <div className="grid">
                    <input placeholder="Número de cuenta" value={formData.NoCuenta || ''} readOnly />
                    <input placeholder="Nombre" value={formData.nombre || ''} readOnly />
                    <input placeholder="Apellido Paterno" value={formData.apellidoPaterno || ''} readOnly />
                    <input placeholder="Apellido Materno" value={formData.apellidoMaterno || ''} readOnly />
                    <input placeholder="CURP" value={formData.curp || ''} readOnly />
                    <input placeholder="Género" value={formData.Genero || ''} readOnly />
                    <input placeholder="Entidad Federativa" value={formData.EntidadFederativa || ''} readOnly />
                </div>
            </div>
            <div className="section">
                <h3>DATOS ESCOLARES</h3>
                <div className="grid">
                    <input placeholder="Bachillerato" value={formData.bachillerato || ''} readOnly />
                    <input placeholder="Fecha Inicio Bachillerato" value={formData.fechaInBach || ''} readOnly />
                    <input placeholder="Fecha Fin Bachillerato" value={formData.fechaFinBach || ''} readOnly />
                    <input placeholder="Programa Educativo" value={formData.programaEducativo || ''} readOnly />
                    <input placeholder="Fecha Inicio Licenciatura" value={formData.fechaInLic || ''} readOnly />
                    <input placeholder="Fecha Fin Licenciatura" value={formData.fechaFinLic || ''} readOnly />
                    <input placeholder="Estado Pasantía" value={formData.pasantia || ''} readOnly />
                    <input placeholder="Modalidad de Titulación" value={formData.modalidad || ''} readOnly />
                </div>
            </div>
            <div className="section">
                <h3>REQUISITOS</h3>
                <div className="grid">
                    <input placeholder="Resultado EGEL" value={formData.Egel || ''} readOnly />
                    <input placeholder="Fecha de Aplicación EGEL" value={formData.fechaEgel || ''} readOnly />
                    <input placeholder="Servicio Social" value={formData.servicioSocial || ''} readOnly />
                    <input placeholder="Prácticas Profesionales" value={formData.practicasProfesionales || ''} readOnly />
                    <input placeholder="Examen de Inglés" value={formData.examenIngles || ''} readOnly />
                    <input placeholder="Fecha Aplicación Inglés" value={formData.fechaInLic || ''} readOnly />
                    <input placeholder="Biblioteca" value={formData.Biblioteca || ''} readOnly />
                    <input placeholder="CEDAI" value={formData.cedai || ''} readOnly />
                    <input placeholder="Laboratorio" value={formData.Laboratorio || ''} readOnly />
                    {renderRequisitos()}
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