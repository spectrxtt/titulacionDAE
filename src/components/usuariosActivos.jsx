import React, { useState, useEffect } from 'react';
import '../styles/usuariosActivos.css';
import Integracion from './Integracion';

const UsuariosActivosChecklist = ({ onConfirmar }) => {
    const [integradores, setIntegradores] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);
    const [mostrarIntegracion, setMostrarIntegracion] = useState(false);

    // Fetch integradores de la base de datos al cargar el componente
    useEffect(() => {
        const obtenerIntegradores = async () => {
            try {
                const response = await fetch('http://10.11.80.167:8000/api/usuarios'); // Cambia la URL según tu API
                if (!response.ok) {
                    throw new Error('Error al obtener usuarios');
                }
                const data = await response.json();

                // Filtra solo los usuarios con el rol de integrador
                const integradoresFiltrados = data.filter(usuario => usuario.rol === 'integrador'); // Asegúrate de que 'rol' es el campo correcto

                setIntegradores(integradoresFiltrados); // Asigna los integradores filtrados a la variable de estado
            } catch (error) {
                console.error('Error al obtener los integradores:', error);
            }
        };

        obtenerIntegradores();
    }, []); // Se ejecuta solo una vez al montar el componente

    const handleCheck = (usuario) => {
        setSeleccionados(prev =>
            prev.includes(usuario)
                ? prev.filter(u => u !== usuario)
                : [...prev, usuario]
        );
    };

    const handleConfirmar = () => {
        if (seleccionados.length === 0) {
            alert("No se ha seleccionado ningún integrador.");
            return;
        }
        // Llama a la función de confirmación pasada como prop
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
                {integradores.map((usuario, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="checkbox"
                                value={usuario.id_usuario} // Usa id_usuario aquí
                                onChange={() => handleCheck(usuario)}
                            />
                            {usuario.nombre_usuario} {/* Suponiendo que 'nombre_usuario' es el campo que quieres mostrar */}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleConfirmar} className="confirm-button">
                Confirmar
            </button>
        </div>
    );
};

export default UsuariosActivosChecklist;
