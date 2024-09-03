import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import { useCitas } from '../manejarCitas';
import datosPersonales from '../../pruebas/datosPersonales';
import { useFormData } from './integracionDatos';

const DatosPersonales = () => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const { citas } = useCitas();
    const { formData, updateFormData } = useFormData();

    useEffect(() => {
        if (citas && citas.length > 0) {
            const citaActual = citas[0];
            const numeroCuenta = citaActual['Numero de cuenta'];
            const datoAdicional = datosPersonales.find(d => d.numCuenta === numeroCuenta);

            if (datoAdicional) {
                updateFormData({
                    ...citaActual,
                    Nombre: datoAdicional.nombre,
                    'Apellido Paterno': datoAdicional.apellidoPaterno,
                    'Apellido Materno': datoAdicional.apellidoMaterno,
                    curp: datoAdicional.curp,
                    Genero: datoAdicional.Genero,
                    EntidadFederativa: datoAdicional.EntidadFederativa
                });
            } else {
                updateFormData(citaActual);
            }
        }
    }, [citas, updateFormData]);

    const handleVerClick = () => {
        setMostrarDatosEscolares(true);
    };

    if (mostrarDatosEscolares) {
        return <DatosEscolares />;
    }

    return (
        <div className="personales">
            <h2>Datos Personales</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="numCuenta">Numero de cuenta</label>
                    <input type="text" id="numCuenta" name="numCuenta" value={formData['Numero de cuenta'] || ''} readOnly />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value={formData['Nombre'] || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <input type="text" id="apellidoPaterno" name="apellidoPaterno" value={formData['Apellido Paterno'] || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <input type="text" id="apellidoMaterno" name="apellidoMaterno" value={formData['Apellido Materno'] || ''} readOnly />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="curp">Curp</label>
                        <input type="text" id="curp" name="curp" value={formData.curp || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Genero">Genero</label>
                        <input type="text" id="Genero" name="Genero" value={formData.Genero || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="EntidadFederativa">Entidad Federativa</label>
                        <input type="text" id="EntidadFederativa" name="EntidadFederativa" value={formData.EntidadFederativa || ''} readOnly />
                    </div>
                </div>
                <div className="boton_integracionS">
                    <button onClick={handleVerClick}><i className="fa-solid fa-arrow-right"></i></button>
                </div>
            </div>
        </div>
    );
}

export default DatosPersonales;