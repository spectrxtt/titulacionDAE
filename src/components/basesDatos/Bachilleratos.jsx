import React, { useState, useEffect, useRef } from 'react';
import '../../styles/bd-bachilleratos.css';
import entidadesFederativas from '../../data/entidadesFederativas.json';



const BachilleratoManagement = () => {
    const [activeView, setActiveView] = useState('none'); // 'none', 'add', 'search'
    const [nombre, setNombre] = useState('');
    const [entidad, setEntidad] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [bachilleratos, setBachilleratos] = useState([]);
    const [selectedBachillerato, setSelectedBachillerato] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [entidadInputValue, setEntidadInputValue] = useState('');
    const [filteredEntidades, setFilteredEntidades] = useState([]);
    const [showEntidadSuggestions, setShowEntidadSuggestions] = useState(false);
    const entidadInputRef = useRef(null);

    useEffect(() => {
        const fetchBachilleratos = async () => {
            try {
                const response = await fetch('http://10.11.80.111:8000/api/bachilleratos');
                const data = await response.json();
                setBachilleratos(data);
            } catch (e) {
                setError('Error al cargar los bachilleratos.');
            }
        };

        fetchBachilleratos();
    }, []);

    const handleAddBachillerato = async () => {
        const datosAEnviar = [
            {
                nombre_bach: nombre,
                bach_entidad: entidad // Aquí debe tener el valor seleccionado o ingresado
            }
        ];

        try {
            const response = await fetch('http://10.11.80.111:8000/api/bachillerato', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosAEnviar),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
            } else {
                setSuccess(true);
                setNombre('');
                setEntidad('');
                setTimeout(() => {
                    setSuccess(false);
                    setActiveView('none');
                }, 3000);
            }
        } catch (e) {
            setError('Ha ocurrido un error al agregar un nuevo bachillerato.');
        }
    };

    const handleEntidadInputChange = (e) => {
        const inputValue = e.target.value;
        setEntidadInputValue(inputValue);
        setEntidad(inputValue); // Actualiza `entidad` con el valor ingresado

        if (inputValue.trim() === '') {
            setFilteredEntidades([]);
            setShowEntidadSuggestions(false);
            return;
        }

        const matchingEntidades = entidadesFederativas.filter((entidad) =>
            entidad.toLowerCase().includes(inputValue.toLowerCase())
        );

        setFilteredEntidades(matchingEntidades);
        setShowEntidadSuggestions(matchingEntidades.length > 0);
    };
    const handleEntidadSelect = (entidad) => {
        setEntidadInputValue(entidad);
        setEntidad(entidad); // Actualiza también el estado de entidad
        setShowEntidadSuggestions(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectBachillerato = (bachillerato) => {
        setSelectedBachillerato(bachillerato);
        setNombre(bachillerato.nombre_bach);
        setEntidadInputValue(bachillerato.bach_entidad);
    };

    const handleUpdateBachillerato = async () => {
        if (!selectedBachillerato) return;

        const datosActualizados = {
            nombre_bach: nombre,
            bach_entidad: entidadInputValue
        };

        try {
            const response = await fetch(`http://10.11.80.111:8000/api/bachillerato/${selectedBachillerato.id_bach}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosActualizados),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setSelectedBachillerato(null);
                }, 3000);
            }
        } catch (e) {
            setError('Error al actualizar el bachillerato.');
        }
    };

    const filteredBachilleratos = searchTerm
        ? bachilleratos.filter((bachillerato) =>
            bachillerato.nombre_bach.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className="bachillerato-container">
            <div className="header-buttons">
                <button
                    className={`btn ${activeView === 'add' ? 'btn-active' : ''}`}
                    onClick={() => setActiveView(activeView === 'add' ? 'none' : 'add')}
                >
                    Añadir Nuevo Bachillerato
                </button>
                <button
                    className={`btn ${activeView === 'search' ? 'btn-active' : ''}`}
                    onClick={() => setActiveView(activeView === 'search' ? 'none' : 'search')}
                >
                    Buscar o Modificar Bachilleratos
                </button>
            </div>

            {activeView === 'add' && (
                <div className="form-container">
                    <h3 className="form-title">Añadir Nuevo Bachillerato</h3>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del Bachillerato</label>
                        <input
                            type="text"
                            id="nombre"
                            className="input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <div className="form-group suggestions-container" ref={entidadInputRef}>
                        <label htmlFor="entidad">Entidad del Bachillerato</label>
                        <input
                            type="text"
                            id="entidad"
                            className="input"
                            value={entidadInputValue || ''}
                            onChange={handleEntidadInputChange}
                            placeholder="Escribe para buscar..."
                        />
                        {showEntidadSuggestions && filteredEntidades.length > 0 && (
                            <ul className="suggestions-list">
                                {filteredEntidades.map((entidad, index) => (
                                    <li key={index} onClick={() => handleEntidadSelect(entidad)}>
                                        {entidad}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button className="btn" onClick={handleAddBachillerato}>
                        Crear Bachillerato
                    </button>
                </div>
            )}

            {activeView === 'search' && (
                <div className="search-section">
                    <h3 className="search-title">Buscar Bachillerato</h3>

                    <input
                        type="text"
                        className="input"
                        placeholder="Buscar bachillerato..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />

                    {filteredBachilleratos.length > 0 && (
                        <div className="search-results-container">
                            <div className="search-results-title">
                                Resultados encontrados: {filteredBachilleratos.length}
                            </div>
                            <ul className="bachillerato-list">
                                {filteredBachilleratos.map((bachillerato) => (
                                    <li
                                        key={bachillerato.id_bach}
                                        onClick={() => handleSelectBachillerato(bachillerato)}
                                        className="bachillerato-item"
                                    >
                                        {bachillerato.nombre_bach} - {bachillerato.bach_entidad}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedBachillerato && (
                        <div className="modify-form">
                            <h4>Modificar Bachillerato Seleccionado</h4>

                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del Bachillerato</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <div className="form-group suggestions-container" ref={entidadInputRef}>
                                <label htmlFor="entidad">Entidad del Bachillerato</label>
                                <input
                                    type="text"
                                    id="entidad"
                                    value={entidadInputValue}
                                    onChange={handleEntidadInputChange}
                                />
                                {showEntidadSuggestions && filteredEntidades.length > 0 && (
                                    <ul className="suggestions-list">
                                        {filteredEntidades.map((entidad, index) => (
                                            <li key={index} onClick={() => handleEntidadSelect(entidad)}>
                                                {entidad}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <button className="btn" onClick={handleUpdateBachillerato}>
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

export default BachilleratoManagement;
