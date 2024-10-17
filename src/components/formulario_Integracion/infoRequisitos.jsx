import React, { useState } from 'react';
import '../../styles/RequisitosButton.css';

const RequisitosButton = ({ requisitosContent = "Requisitos" }) => {
    const [mostrarCuadroRequisitos, setMostrarCuadroRequisitos] = useState(false);

    const handleMostrarCuadroRequisitos = () => {
        setMostrarCuadroRequisitos(!mostrarCuadroRequisitos);
    };

    return (
        <div className="requisitos-button-container">
            <button onClick={handleMostrarCuadroRequisitos}>
                <i className="fa-solid fa-circle-question"></i> {/* Cambia class a className */}
            </button>
            {mostrarCuadroRequisitos && (
                <div className="cuadro-requisitos">
                    <p>{requisitosContent}</p>
                </div>
            )}
        </div>
    );
};

export default RequisitosButton;
