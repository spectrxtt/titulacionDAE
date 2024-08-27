import React, { useState } from 'react';
import '../../styles/formularioIntegracion.css';
import DatosEscolares from './datosEscolares';

const DatosPersonales= () => {

    const [mostrarDatosEscolares, setMostrarDatosEscolares] = useState(false);

    const handleVerClick = () => {
        setMostrarDatosEscolares(true);
    };

    if (mostrarDatosEscolares) {
        return <DatosEscolares/>;
    }

    return (
        <div className="personales">
            <h2>Datos Personales</h2>
            <div className="form-container-personales">
                <div className="form-group-personales">
                    <label htmlFor="numCuenta">Numero de cuenta</label>
                    <input type="text" id="numCuenta" name="numCuenta" placeholder="Ej: 12345"/>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="Nombre">Nombre</label>
                        <input type="text" id="Nombre" name="Nombre" placeholder="Ej: María"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="apPaterno">Apellido Paterno</label>
                        <input type="text" id="apPaterno" name="apPaterno" placeholder="Ej: García"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="apMaterno">Apellido Materno</label>
                        <input type="text" id="apMaterno" name="apMaterno" placeholder="Ej: López"/>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="curp">Curp</label>
                        <input type="text" id="curp" name="curp" placeholder="Ej: HEGJ9..."/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="genero">Genero</label>
                        <select id="genero" name="genero">
                            <option value="">Seleccione el genero</option>
                            <option>Femenino</option>
                            <option>Masculino</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="entidad">Entidad Federativa</label>
                        <select id="entidad" name="entidad">
                            <option value="">Seleccione Estado</option>
                            <option>Estado 1</option>
                            <option>Estado 2</option>
                        </select>
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