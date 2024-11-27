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
                    <button className="modal-button modal-button-cancel" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="modal-button modal-button-confirm" onClick={onConfirm}>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProgramasModalidadRequisitos = () => {
    const [programas, setProgramas] = useState([]);
    const [modalidades, setModalidades] = useState([]);
    const [requisitos, setRequisitos] = useState([]);
    const [selectedPrograma, setSelectedPrograma] = useState(null);
    const [selectedModalidad, setSelectedModalidad] = useState(null);
    const [newRequisito, setNewRequisito] = useState('');
    const [editingRequisito, setEditingRequisito] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    const fetchModalidades = async (idPrograma) => {
        setSelectedPrograma(idPrograma);
        try {
            const response = await fetch(`http://10.11.80.111:8000/api/modalidades-titulacion`);
            const data = await response.json();
            console.log(data);  // Verificar lo que se recibe
            setModalidades(data);
        } catch (e) {
            setError('Error al cargar las modalidades de titulación.');
        }
    };

    const fetchRequisitosPorModalidad = async (idPrograma, idModalidad) => {
        setSelectedModalidad(idModalidad);
        try {
            const response = await fetch(`http://10.11.80.111:8000/api/requisitos-modalidad/${idPrograma}/${idModalidad}`);
            const data = await response.json();
            setRequisitos(data);
        } catch (e) {
            setError('Error al cargar los requisitos de la modalidad.');
        }
    };

    const handleAddRequisito = async () => {
        if (!newRequisito.trim()) return;

        // Crear el objeto con la estructura deseada
        const data = [
            {
                id_modalidad: selectedModalidad,
                id_programa_educativo: selectedPrograma,
                descripcion: newRequisito,
            }
        ];

        try {
            // Enviar los datos en formato array
            const response = await fetch('http://10.11.80.111:8000/api/requisitos-modalidad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),  // Enviar el objeto como un array
            });

            if (response.ok) {
                setSuccess(true);
                setNewRequisito('');  // Limpiar el campo de entrada
                // Volver a obtener los requisitos con los datos actualizados
                fetchRequisitosPorModalidad(selectedPrograma, selectedModalidad);
                setTimeout(() => setSuccess(false), 3000);  // Restablecer el estado de éxito después de 3 segundos
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

        try {
            const response = await fetch(
                `http://10.11.80.111:8000/api/requisitos/modalidad/${editingRequisito.id_requisito_modalidad}`,
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
                setEditingRequisito(null);
                fetchRequisitosPorModalidad(selectedPrograma, selectedModalidad);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError('Error al modificar el requisito.');
            }
        } catch (e) {
            setError('Error al realizar la operación.');
        }
    };
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [requisitionToDelete, setRequisitionToDelete] = useState(null);
    // Modificar la función de eliminación
    const handleDeleteRequisito = async () => {
        if (!requisitionToDelete) return;

        try {
            const response = await fetch('http://10.11.80.111:8000/api/requisitos/modalidad/delete', {
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
                fetchRequisitosPorModalidad(selectedPrograma, selectedModalidad);
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

    // Nuevo estado para el modal de confirmación

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

            {/* Mensajes de error o éxito */}
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Operación realizada con éxito.</div>}

            {/* Sección de búsqueda */}
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
                        <h2>Programas Disponibles</h2>
                        <ul className="bachillerato-list">
                            {filteredProgramas.map((programa) => (
                                <li
                                    key={programa.id_programa_educativo}
                                    onClick={() => fetchModalidades(programa.id_programa_educativo)}
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

            {/* Modalidades */}
            {selectedPrograma && modalidades.length > 0 && (
                <div className="modalidades-section">
                    <h2>Modalidades del Programa</h2>
                    <div className="modalidades-container">
                        {modalidades.map((modalidad) => (
                            <div
                                key={modalidad.id_modalidad}
                                onClick={() => fetchRequisitosPorModalidad(selectedPrograma, modalidad.id_modalidad)}
                                className={`modalidad-card ${
                                    selectedModalidad === modalidad.id_modalidad ? 'active' : ''
                                }`}
                            >
                                {modalidad.modalidad_titulacion}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Requisitos */}
            {selectedModalidad && (
                <div className="requisitos-section">
                    <h2>Requisitos de la Modalidad</h2>
                    <div className="requisitos-container">
                        {requisitos.length > 0 ? (
                            requisitos.map((req) => (
                                <div className="requisito-card" key={req.id_requisito_modalidad}>
                                    {editingRequisito && editingRequisito.id_requisito_modalidad === req.id_requisito_modalidad ? (
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
                                                <button className="btn btn-edit" onClick={() => setEditingRequisito(req)}>
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-delete"
                                                    onClick={() => openDeleteConfirmModal(req.id_requisito_modalidad)}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No hay requisitos para esta modalidad.</p>
                        )}
                    </div>

                    {/* Añadir nuevo requisito */}
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
                            Añadir Requisito
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de confirmación */}
            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={closeDeleteConfirmModal}
                onConfirm={handleDeleteRequisito}
                message="¿Está seguro que desea eliminar este requisito? Esta acción no se puede deshacer."
            />
        </div>
    );

};

export default ProgramasModalidadRequisitos;
