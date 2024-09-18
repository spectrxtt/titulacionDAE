import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import { useCitas } from '../manejarCitas';
import datosPersonales from '../../pruebas/datosPersonales';
import { useFormData } from './integracionDatos';
import GenerarReporte from "./GenerarReporte";

const DatosPersonales = ({ citaSeleccionada }) => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const [mostrarGenerarReporte, setMostrarGenerarReporte] = useState(false);
    const { formData, updateFormData } = useFormData();

    useEffect(() => {
        if (citaSeleccionada) {
            const numeroCuenta = citaSeleccionada['No.Cuenta'];
            const datoAdicional = datosPersonales.find(d => d.numCuenta === numeroCuenta);

            if (datoAdicional) {
                updateFormData({
                    ...citaSeleccionada,
                    NoCuenta: datoAdicional.numCuenta,
                    nombre: datoAdicional.nombre,
                    apellidoPaterno: datoAdicional.apellidoPaterno,
                    apellidoMaterno: datoAdicional.apellidoMaterno,
                    curp: datoAdicional.curp,
                    Genero: datoAdicional.Genero,
                    EntidadFederativa: datoAdicional.EntidadFederativa
                });
            } else {
                updateFormData(citaSeleccionada);
            }
        }
    }, [citaSeleccionada, updateFormData]);

    const handleVerClick = () => {
        setMostrarDatosEscolares(true);
    };

    const handleGenerarReporteClick = () => {
        setMostrarGenerarReporte(true);
    };

    if (mostrarDatosEscolares) {
        return <DatosEscolares citaSeleccionada={citaSeleccionada} />;
    }
    if (mostrarGenerarReporte) {
        return <GenerarReporte />;
    }
    return (
        <div className="personales">
            <div className="boton_generarReporte">
                <button onClick={handleGenerarReporteClick}>
                    <i className="fa-solid fa-triangle-exclamation"></i>
                </button>
            </div>
            <h2>Datos Personales</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="numCuenta">Numero de cuenta</label>
                    <input
                        type="text"
                        id="numCuenta"
                        name="numCuenta"
                        value={formData.NoCuenta || ''}
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <input
                            type="text"
                            id="apellidoPaterno"
                            name="apellidoPaterno"
                            value={formData.apellidoPaterno || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <input
                            type="text"
                            id="apellidoMaterno"
                            name="apellidoMaterno"
                            value={formData.apellidoMaterno || ''}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="curp">Curp</label>
                        <input
                            type="text"
                            id="curp"
                            name="curp"
                            value={formData.curp || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Genero">Genero</label>
                        <input
                            type="text"
                            id="Genero"
                            name="Genero"
                            value={formData.Genero || ''}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="EntidadFederativa">Entidad Federativa</label>
                        <input
                            type="text"
                            id="EntidadFederativa"
                            name="EntidadFederativa"
                            value={formData.EntidadFederativa || ''}
                        />
                    </div>
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClick}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DatosPersonales;
