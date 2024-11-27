import React, { useState, useEffect } from 'react';
import '../../styles/bd-bachilleratos.css'; // Ajusta la ruta según sea necesario

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Confirmar eliminación</h2>
                </div>
                <div className="modal-body">
                    <p>{message}</p>
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

const ProgramasEducativosRequisitos = () => {
    const [programas, setProgramas] = useState([]);
    const [requisitos, setRequisitos] = useState([]);
    const [selectedPrograma, setSelectedPrograma] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newRequisito, setNewRequisito] = useState('');
    const [editingRequisito, setEditingRequisito] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await fetch('http://10.11.80.111:8000/api/programas-educativos');
                const data = await response.json();
                setProgramas(data);
            } catch (e) {
                setError('Error al cargar los programas educativos.');
            }
        };

        fetchProgramas();
    }, []);

    const fetchRequisitos = async (idPrograma) => {
        setSelectedPrograma(idPrograma);
        try {
            const response = await fetch(`http://10.11.80.111:8000/api/programas-educativos/${idPrograma}/requisitos`);
            const data = await response.json();
            console.log('Requisitos cargados:', data); // Verifica que la respuesta contiene los datos esperados
            setRequisitos(data);
        } catch (e) {
            setError('Error al cargar los requisitos del programa.');
        }
    };


    const handleAddRequisito = async () => {
        if (!newRequisito.trim()) return;

        // Ajustar el formato de los datos según lo solicitado
        const data = [
            {
                id_programa_educativo: selectedPrograma,
                descripcion: newRequisito,
            },
        ];

        try {
            const response = await fetch('http://10.11.80.111:8000/api/requisitos-programa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Convertir a JSON el array de objetos
            });

            if (response.ok) {
                setSuccess(true);
                setNewRequisito(''); // Limpiar el campo de entrada
                fetchRequisitos(selectedPrograma); // Refrescar la lista de requisitos
                setTimeout(() => setSuccess(false), 3000); // Ocultar mensaje de éxito después de 3 segundos
            } else {
                setError('Error al agregar el requisito.');
            }
        } catch (e) {
            setError('Error al realizar la operación.');
        }
    };


    const handleUpdateRequisito = async () => {
        if (!editingRequisito || !editingRequisito.descripcion.trim()) return;

        const data = { descripcion: editingRequisito.descripcion };

        console.log('Editando requisito:', editingRequisito); // Verifica el objeto completo

        try {
            const response = await fetch(
                `http://10.11.80.111:8000/api/requisitos-programa/${editingRequisito.id_requisito_programa}`, // Asegúrate de que el id esté correcto
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                setSuccess(true);
                setEditingRequisito(null); // Limpiar el estado de edición
                fetchRequisitos(selectedPrograma); // Refrescar la lista de requisitos
                setTimeout(() => setSuccess(false), 3000); // Mostrar mensaje de éxito por 3 segundos
            } else {
                setError('Error al modificar el requisito.');
            }
        } catch (e) {
            setError('Error al realizar la operación.');
        }
    };
    // Nuevo estado para el modal de confirmación
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [requisitionToDelete, setRequisitionToDelete] = useState(null);

    // Modificar la función de eliminación
    const handleDeleteRequisito = async () => {
        if (!requisitionToDelete) return;

        try {
            const response = await fetch('http://10.11.80.111:8000/api/requisitos-programa/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requisitos_a_eliminar: [requisitionToDelete]
                }),
            });

            if (response.ok) {
                setSuccess(true);
                fetchRequisitos(selectedPrograma);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Error al eliminar el requisito.');
            }

            // Cerrar el modal después de la operación
            setConfirmModalOpen(false);
            setRequisitionToDelete(null);
        } catch (e) {
            setError('Error al realizar la operación de eliminación.');
            setConfirmModalOpen(false);
            setRequisitionToDelete(null);
        }
    };

    // Función para abrir el modal de confirmación
    const openDeleteConfirmModal = (idRequisito) => {
        setRequisitionToDelete(idRequisito);
        setConfirmModalOpen(true);
    };

    // Función para cerrar el modal
    const closeDeleteConfirmModal = () => {
        setConfirmModalOpen(false);
        setRequisitionToDelete(null);
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProgramas = searchTerm
        ? programas.filter((programa) =>
            programa.programa_educativo.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : programas;

    return (
        <div className="bachillerato-container">
            <h1>Programas Educativos</h1>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Operación realizada con éxito.</div>}

            <div className="search-section">
                <input
                    type="text"
                    className="input"
                    placeholder="Buscar programa educativo..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                {filteredProgramas.length > 0 && (
                    <div className="search-results-container">
                        <div className="search-results-title">
                            Resultados encontrados: {filteredProgramas.length}
                        </div>
                        <ul className="bachillerato-list">
                            {filteredProgramas.map((programa) => (
                                <li
                                    key={programa.id_programa_educativo}
                                    onClick={() => fetchRequisitos(programa.id_programa_educativo)}
                                    className={`bachillerato-item ${
                                        selectedPrograma === programa.id_programa_educativo ? 'active' : ''
                                    }`}
                                >
                                    {programa.programa_educativo}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {selectedPrograma && (
                <div className="requisitos-section">
                    <h2>Requisitos del Programa</h2>

                    <div className="requisitos-container">
                        {requisitos.length > 0 ? (
                            requisitos.map((req) => (
                                <div className="requisito-card" key={req.id_requisito}>
                                    {editingRequisito && editingRequisito.id_requisito === req.id_requisito ? (
                                        <div className="requisito-edit">
                                            <input
                                                type="text"
                                                className="input"
                                                value={editingRequisito.descripcion}
                                                onChange={(e) =>
                                                    setEditingRequisito({
                                                        ...editingRequisito,
                                                        descripcion: e.target.value,
                                                    })
                                                }
                                            />
                                            <button className="btn" onClick={handleUpdateRequisito}>
                                                Guardar
                                            </button>
                                            <button
                                                className="btn btn-cancel"
                                                onClick={() => setEditingRequisito(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="requisito-descripcion">{req.descripcion}</p>
                                            <div className="requisito-actions">
                                                <button
                                                    className="btn btn-edit"
                                                    onClick={() => setEditingRequisito(req)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() => openDeleteConfirmModal(req.id_requisito_programa)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No hay requisitos para este programa.</p>
                        )}
                    </div>

                    <div className="add-requisito">
                        <h3>Añadir Nuevo Requisito</h3>
                        <input
                            type="text"
                            className="input"
                            placeholder="Nuevo requisito..."
                            value={newRequisito}
                            onChange={(e) => setNewRequisito(e.target.value)}
                        />
                        <button className="btn" onClick={handleAddRequisito}>
                            Añadir Requisitor
                        </button>
                    </div>
                </div>
            )}
            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={closeDeleteConfirmModal}
                onConfirm={handleDeleteRequisito}
                message="¿Está seguro que desea eliminar este requisito? Esta acción no se puede deshacer."
            />
        </div>
    );

};

export default ProgramasEducativosRequisitos;


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

// Agregar los estilos al documento
const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = modalStyles
document.head.appendChild(styleSheet)