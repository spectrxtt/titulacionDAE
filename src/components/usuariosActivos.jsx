import React, { useState } from 'react';
import '../styles/usuariosActivos.css';
import Integracion from './Integracion';

const UsuariosActivosChecklist = ({ usuarios, onConfirmar }) => {
    const [seleccionados, setSeleccionados] = useState([]);
    const [mostrarIntegracion, setMostrarIntegracion] = useState(false);

    const handleCheck = (usuario) => {
        setSeleccionados(prev =>
            prev.includes(usuario)
                ? prev.filter(u => u !== usuario)
                : [...prev, usuario]
        );
    };
    const handleVerClick = () => {
        setMostrarIntegracion(true);
    };
    const handleConfirmar = () => {
        onConfirmar(seleccionados);
    };
    if (mostrarIntegracion) {
        return <Integracion onClose={() => setMostrarIntegracion(false)} />;
    }

    return (
        <div className="usuarios-activos-checklist">
            <h3>Integradores</h3>
            <p>Elija los integradores activos</p>
            <ul>
                {usuarios.map((usuario, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="checkbox"
                                value={usuario}
                                onChange={() => handleCheck(usuario)}
                            />
                            {usuario}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={(e) => {
                handleConfirmar(e);
                handleVerClick(e);
            }} className="confirm-button">
                Confirmar
            </button>

        </div>
    );
};

export default UsuariosActivosChecklist;
