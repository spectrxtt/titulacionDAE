import React, { useState, useEffect } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';
import { useCitas } from '../manejarCitas';
import datosPersonales from '../../pruebas/datosPersonales';

const DatosPersonales = () => {
    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);
    const [datosActuales, setDatosActuales] = useState({});
    const { citas } = useCitas();

    useEffect(() => {
        if (citas && citas.length > 0) {
            const citaActual = citas[0]; // Asumimos que queremos mostrar la primera cita
            const numeroCuenta = citaActual['Numero de cuenta'];

            // Buscar datos adicionales en datosPersonales
            const datoAdicional = datosPersonales.find(d => d.numCuenta === numeroCuenta);

            // Si encontramos un dato adicional, fusionarlo con la cita actual
            if (datoAdicional) {
                setDatosActuales({
                    ...citaActual,
                    Nombre: datoAdicional.nombre,
                    'Apellido Paterno': datoAdicional.apellidoPaterno,
                    'Apellido Materno': datoAdicional.apellidoMaterno,
                    curp: datoAdicional.curp,
                    Genero: datoAdicional.Genero,
                    EntidadFederativa: datoAdicional.EntidadFederativa
                });
            } else {
                setDatosActuales(citaActual);
            }
        }
    }, [citas]);

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
                    <input type="text" id="numCuenta" name="numCuenta" value={datosActuales['Numero de cuenta'] || ''} readOnly />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre</label>
                        <input type="text" id="nombre" name="nombre" value={datosActuales['Nombre'] || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoPaterno">Apellido Paterno</label>
                        <input type="text" id="apellidoPaterno" name="apellidoPaterno" value={datosActuales['Apellido Paterno'] || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellidoMaterno">Apellido Materno</label>
                        <input type="text" id="apellidoMaterno" name="apellidoMaterno" value={datosActuales['Apellido Materno'] || ''} readOnly />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="curp">Curp</label>
                        <input type="text" id="curp" name="curp" value={datosActuales.curp || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Genero">Genero</label>
                        <input type="text" id="Genero" name="Genero" value={datosActuales.Genero || ''} readOnly />
                    </div>
                    <div className="form-group">
                        <label htmlFor="EntidadFederativa">Entidad Federativa</label>
                        <input type="text" id="EntidadFederativa" name="EntidadFederativa" value={datosActuales.EntidadFederativa || ''} readOnly />
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
