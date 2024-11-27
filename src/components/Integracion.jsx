import React, { useState, useEffect } from 'react';
import '../styles/Integracion.css';
import DatosPersonales from './formulario_Integracion/datosPersonales';

// Agregar estos estilos a tu archivo CSS
const modalStyles = `
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
}

.modal-header {
    margin-bottom: 20px;
}

.modal-title {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

.modal-body {
    margin-bottom: 20px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.modal-button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
}

.modal-button-cancel {
    background-color: #e0e0e0;
}

.modal-button-confirm {
    background-color: #dc2626;
    color: white;
}
`;

// Componente Modal personalizado
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Confirmar eliminación</h2>
                </div>
                <div className="modal-body">
                    <p>¿Está seguro que desea eliminar esta cita? Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-footer">
                    <button
                        className="modal-button modal-button-cancel"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="modal-button modal-button-confirm"
                        onClick={onConfirm}
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

const Integracion = ({ userRole }) => {
    const [citas, setCitas] = useState([]);
    const [mostrarDatosPersonales, setMostrarDatosPersonales] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [citaAEliminar, setCitaAEliminar] = useState(null);
    const [totalCitas, setTotalCitas] = useState(0);

    const formatDateS = (fecha) => {
        if (!fecha) return 'N/A';
        const fechaObj = new Date(fecha);
        if (isNaN(fechaObj.getTime())) return 'N/A';

        // Ajustar la fecha para compensar la diferencia de zona horaria
        const offsetMs = fechaObj.getTimezoneOffset() * 60 * 1000;
        const adjustedDate = new Date(fechaObj.getTime() + offsetMs);

        const dia = adjustedDate.getDate().toString().padStart(2, '0');
        const mes = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
        const año = adjustedDate.getFullYear();
        return `${dia}-${mes}-${año}`;
    };

    // Inyectar estilos del modal
    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = modalStyles;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    const handleVerClick = (cita) => {
        setCitaSeleccionada(cita);
        setMostrarDatosPersonales(true);
    };

    // Función para mostrar el modal de confirmación
    const handleDeleteRequest = (id_cita) => {
        setCitaAEliminar(id_cita);
    };

    // Función para cancelar la eliminación
    const handleCancelDelete = () => {
        setCitaAEliminar(null);
    };

    // Función para confirmar y ejecutar la eliminación
    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://10.11.80.111:8000/api/citas/${citaAEliminar}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la cita');
            }

            setCitas((prevCitas) => prevCitas.filter(cita => cita.id_cita !== citaAEliminar));
            setCitaAEliminar(null);
            alert('Cita eliminada con éxito');
        } catch (error) {
            console.error('Error al eliminar cita:', error);
            setError(error.message);
            alert('Error al eliminar la cita');
        }
    };

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://10.11.80.111:8000/api/citas', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al cargar citas');
                }

                const data = await response.json();
                const citasFiltradas = data.filter(cita =>
                    !['Integrado', 'Rechazado', 'Cancelado','Corrección Atendida'].includes(cita.estado_cita)
                );

                setCitas(citasFiltradas);
            } catch (error) {
                console.error('Error al cargar citas:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCitas();
    }, []);
    // Actualiza el total de citas cuando las citas cambian
    useEffect(() => {
        setTotalCitas(citas.length); // Asume que `citas` es el array de citas filtradas
    }, [citas]);

    if (loading) {
        return <div>Cargando citas...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (mostrarDatosPersonales) {
        return <DatosPersonales citaSeleccionada={citaSeleccionada} />;
    }

    return (
        <div className="containerIntegracion">
            <h3>CITAS DEL DÍA: {citas.length}</h3>
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                    <tr>
                        <th># Cuenta</th>
                        <th>Nombre</th>
                        <th>Programa Educativo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Observaciones</th>
                        <th>Integrador</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {citas.map((cita, index) => (
                        <tr key={index}>
                            <td>{cita.num_Cuenta || 'N/A'}</td>
                            <td>{cita.nombre || 'N/A'}</td>
                            <td>{cita.programa_educativo || 'N/A'}</td>
                            <td>{formatDateS(cita.fecha || 'N/A')}</td>
                            <td>{cita.estado_cita || 'N/A'}</td>
                            <td>{cita.observaciones || 'N/A'}</td>
                            <td>{cita.usuario?.nombre_usuario || 'N/A'}</td>
                            <td>
                                <button className="button" onClick={() => handleVerClick(cita)}>
                                    VER
                                </button>
                                {(userRole === 'impresion' || userRole === 'admin') && (
                                    <button
                                        className="button delete-button"
                                        onClick={() => handleDeleteRequest(cita.id_cita)}
                                    >
                                        ELIMINAR
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={citaAEliminar !== null}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default Integracion;