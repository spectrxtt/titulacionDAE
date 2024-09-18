import React from 'react';
import '../styles/notificaciones.css';


const AlertasYNotificaciones = () => {
    const alertas = [
        { id: 1, texto: ' ', completada: false },

    ];

    return (

        <div className={"containerNotify"}>
            <h3>ALERTAS Y NOTIFICACIONES</h3>
            <ul className={"list"}>
                {alertas.map((alerta) => (
                    <li key={alerta.id} className={"listItem"}>
                        <span>{alerta.texto}</span>
                        <span>{alerta.completada ? '✔️' : '❗'}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlertasYNotificaciones;
