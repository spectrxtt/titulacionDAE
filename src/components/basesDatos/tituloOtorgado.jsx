import React, { useState, useEffect } from 'react';
import '../../styles/bd-bachilleratos.css'; // Ajusta la ruta si es necesario

const TituloOtorgadoManagement = () => {
    const [activeView, setActiveView] = useState('none'); // 'none', 'add', 'search'
    const [nombre, setNombre] = useState('');
    const [titulos, settitulos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedtitulo, setSelectedtitulo] = useState(null); // titulo seleccionado para modificar
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchtitulos = async () => {
            try {
                const response = await fetch('http://10.11.80.111:8000/api/titulo-otorgado');
                const data = await response.json();
                settitulos(data);
            } catch (e) {
                setError('Error al cargar los titulos otorgados.');
            }
        };

        fetchtitulos();
    }, []);

    const handleAddtitulo = async () => {
        const datosAEnviar = [
            {
                titulo_otorgado: nombre // El nombre debe ser el valor del campo de entrada
            }
        ];

        try {
            const response = await fetch('http://10.11.80.111:8000/api/titulo-otorgado', {
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

    const filteredtitulos = searchTerm
        ? titulos.filter((titulo) =>
            titulo.titulo_otorgado.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : titulos;

    const handleSelecttitulo = (titulo) => {
        setSelectedtitulo(titulo);
        setNombre(titulo.titulo_otorgado);
    };

    const handleUpdatetitulo = async () => {
        if (!selectedtitulo) return;

        const datosAEnviar = { titulo_otorgado: nombre };

        try {
            const response = await fetch(`http://10.11.80.111:8000/api/titulo-otorgadoM/${selectedtitulo.id_titulo_otorgado}`, {
                method: 'PUT',
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
                setTimeout(() => {
                    setSuccess(false);
                    setSelectedtitulo(null);
                    setNombre('');
                }, 3000);

                // Recargar los titulos
                const updatedResponse = await fetch('http://10.11.80.111:8000/api/titulo-otorgado');
                const updatedData = await updatedResponse.json();
                settitulos(updatedData);
            }
        } catch (e) {
            setError('Ha ocurrido un error al actualizar el titulo otorgado.');
        }
    };

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
                    Añadir Nuevo Titulo Otorgado
                </button>
                <button
                    className={`btn ${activeView === 'search' ? 'btn-active' : ''}`}
                    onClick={() => setActiveView(activeView === 'search' ? 'none' : 'search')}
                >
                    Buscar o Modificar Titulos Otorgados
                </button>
            </div>

            {activeView === 'add' && (
                <div className="form-container">
                    <h3 className="form-title">Añadir Nuevo Titulo Otorgado</h3>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del Titulo Otorgado</label>
                        <input
                            type="text"
                            id="nombre"
                            className="input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <button className="btn" onClick={handleAddtitulo}>
                        Crear Titulo Otorgado
                    </button>
                </div>
            )}

            {activeView === 'search' && (
                <div className="search-section">
                    <h3 className="search-title">Buscar Titulo Otorgado</h3>

                    <input
                        type="text"
                        className="input"
                        placeholder="Buscar Titulo Otorgado..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />

                    {filteredtitulos.length > 0 && (
                        <div className="search-results-container">
                            <div className="search-results-title">
                                Resultados encontrados: {filteredtitulos.length}
                            </div>
                            <ul className="bachillerato-list">
                                {filteredtitulos.map((titulo) => (
                                    <li
                                        key={titulo.id_titulo_otorgado}
                                        onClick={() => handleSelecttitulo(titulo)}
                                        className="bachillerato-item"
                                    >
                                        {titulo.titulo_otorgado}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedtitulo && (
                        <div className="modify-form">
                            <h4>Modificar Titulo Otorgado Seleccionado</h4>

                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del titulo Otorgado</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <button className="btn" onClick={handleUpdatetitulo}>
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

export default TituloOtorgadoManagement;
