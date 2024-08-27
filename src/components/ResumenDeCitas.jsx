import React, { useState } from 'react';
import '../styles/citas.css';
import DatosPersonales from "./formulario_Integracion/datosPersonales";


const ResumenDeCitas = () => {
    const [citas, setCitas] = useState([
        { id: 1, cuenta: '12345', nombre: 'Carlos Pérez López', fecha: '13/08/24', estado: 'Pendiente' },
        { id: 2, cuenta: '12345', nombre: 'Carlos Pérez López', fecha: '13/08/24', estado: 'Pendiente' },
        { id: 3, cuenta: '12345', nombre: 'Carlos Pérez López', fecha: '13/08/24', estado: 'Pendiente' },
    ]);

    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);

    const handleVerClick = () => {
        setMostrarDatosPersonales(true);
    };

    if (mostrarDatosPersonales) {
        return <DatosPersonales />;
    }

    return (
        <div className="containerCitas">
            <h3>RESUMEN DE CITAS DEL DÍA</h3>
            <table className="table">
                <thead>
                <tr>
                    <th># Cuenta</th>
                    <th>Nombre</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {citas.map((cita) => (
                    <tr key={cita.id}>
                        <td>{cita.cuenta}</td>
                        <td>{cita.nombre}</td>
                        <td>{cita.fecha}</td>
                        <td>{cita.estado}</td>
                        <td>
                            <button className="button" onClick={handleVerClick}>VER</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResumenDeCitas;