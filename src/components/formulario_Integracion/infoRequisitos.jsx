import React, { useState } from 'react';
import '../../styles/RequisitosButton.css';

const RequisitosButton = ({ requisitosContent = "Requisitos" }) => {
    const [mostrarCuadroRequisitos, setMostrarCuadroRequisitos] = useState(false);

    const handleMostrarCuadroRequisitos = () => {
        setMostrarCuadroRequisitos(!mostrarCuadroRequisitos);
    };

    return (
        <div className="requisitos-button-container">
            <button onClick={handleMostrarCuadroRequisitos}><i class="fa-solid fa-circle-question"></i></button>
            {mostrarCuadroRequisitos && (
                <div className="cuadro-requisitos">
                    <p>{requisitosContent}</p>
                </div>
            )}
        </div>
    );
};

export default RequisitosButton;