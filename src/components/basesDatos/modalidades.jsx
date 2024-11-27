import React, { useState, useEffect } from 'react';
import '../../styles/bd-bachilleratos.css'; // Ajusta la ruta si es necesario

const ModalidadesManagement = () => {
    const [activeView, setActiveView] = useState('none'); // 'none', 'add', 'search'
    const [nombre, setNombre] = useState('');
    const [modalidades, setmodalidades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedmodalidad, setSelectedmodalidad] = useState(null); // titulo seleccionado para modificar
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchtitulos = async () => {
            try {
                const response = await fetch('http://10.11.80.111:8000/api/modalidades-titulacion');
                const data = await response.json();
                setmodalidades(data);
            } catch (e) {
                setError('Error al cargar las Modalidades de Titulación.');
            }
        };

        fetchtitulos();
    }, []);

    const handleAddmodalidad = async () => {
        const datosAEnviar = [
            {
                modalidad_titulacion: nombre // El nombre debe ser el valor del campo de entrada
            }
        ];

        try {
            const response = await fetch('http://10.11.80.111:8000/api/modalidad-titulacion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosAEnviar), // Enviar el array de objetos en el cuerpo
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
            } else {
                setSuccess(true);
                setNombre(''); // Limpiar el campo después de añadir el titulo
                setTimeout(() => {
                    setSuccess(false);
                    setActiveView('none');
                }, 3000);
            }
        } catch (e) {
            setError('Ha ocurrido un error al agregar el titulo otorgado.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredmodalidades = searchTerm
        ? modalidades.filter((modalidad) =>
            modalidad.modalidad_titulacion.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : modalidades;

    const handleSelectmodalidad = (modalidad) => {
        setSelectedmodalidad(modalidad);
        setNombre(modalidad.modalidad_titulacion);
    };

    const handleUpdatemodalidad = async () => {
        if (!selectedmodalidad) return;

        const datosAEnviar = { modalidad_titulacion: nombre };

        try {
            const response = await fetch(`http://10.11.80.111:8000/api/modalidades-titulacionM/${selectedmodalidad.id_modalidad}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosAEnviar),
            });

            // Verificar si la respuesta fue exitosa
            if (response.ok) {
                setSuccess(true);

                // Actualizar la lista de modalidades
                const updatedResponse = await fetch('http://10.11.80.111:8000/api/modalidades-titulacion');
                const updatedData = await updatedResponse.json();
                setmodalidades(updatedData);

                // Limpiar los estados después de un tiempo
                setTimeout(() => {
                    setSuccess(false);
                    setSelectedmodalidad(null);
                    setNombre('');
                }, 3000);
            } else {
                // Si la respuesta no fue exitosa, procesar el mensaje de error
                const errorData = await response.json();
                setError(errorData.error || 'Hubo un problema al actualizar la modalidad.');
            }
        } catch (e) {
            setError('Ha ocurrido un error al actualizar la Modalidad de Titulación.');
        }
    };
    ;

    return (
        <div className="bachillerato-container">
            <div className="header-buttons">
                <button
                    className={`btn ${activeView === 'add' ? 'btn-active' : ''}`}
                    onClick={() => {
                        setActiveView(activeView === 'add' ? 'none' : 'add');
                        setNombre(''); // Limpiar el campo al cambiar a la vista de añadir
                    }}
                >
                    Añadir Nueva Modalidad de Titulación
                </button>
                <button
                    className={`btn ${activeView === 'search' ? 'btn-active' : ''}`}
                    onClick={() => setActiveView(activeView === 'search' ? 'none' : 'search')}
                >
                    Buscar o Modificar Modalidad de Titulación
                </button>
            </div>

            {activeView === 'add' && (
                <div className="form-container">
                    <h3 className="form-title">Añadir Nueva Modalidad de Titulación</h3>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre de la Modalidad de Titulación</label>
                        <input
                            type="text"
                            id="nombre"
                            className="input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <button className="btn" onClick={handleAddmodalidad}>
                        Crear Modalidad de Titulación
                    </button>
                </div>
            )}

            {activeView === 'search' && (
                <div className="search-section">
                    <h3 className="search-title">Buscar Modalidad de Titulacion</h3>

                    <input
                        type="text"
                        className="input"
                        placeholder="Buscar Modalidad de Titulación..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />

                    {filteredmodalidades.length > 0 && (
                        <div className="search-results-container">
                            <div className="search-results-title">
                                Resultados encontrados: {filteredmodalidades.length}
                            </div>
                            <ul className="bachillerato-list">
                                {filteredmodalidades.map((modalidad) => (
                                    <li
                                        key={modalidad.id_modalidad}
                                        onClick={() => handleSelectmodalidad(modalidad)}
                                        className="bachillerato-item"
                                    >
                                        {modalidad.modalidad_titulacion}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedmodalidad && (
                        <div className="modify-form">
                            <h4>Modificar Modalidad de Titulación Seleccionada</h4>

                            <div className="form-group">
                                <label htmlFor="nombre">Nombre de la Modalidad de Titulación</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <button className="btn" onClick={handleUpdatemodalidad}>
                                Confirmar Modificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="error-message">
                    <h4>Error</h4>
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="success-message">
                    <h4>¡Cambio Exitoso!</h4>
                    <p>El cambio se realizó correctamente.</p>
                </div>
            )}
        </div>
    );
};

export default ModalidadesManagement;
