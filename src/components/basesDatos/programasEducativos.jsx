import React, { useState, useEffect } from 'react';
import '../../styles/bd-bachilleratos.css'; // Ajusta la ruta si es necesario

const ProgramaEducativoManagement = () => {
    const [activeView, setActiveView] = useState('none'); // 'none', 'add', 'search'
    const [nombre, setNombre] = useState('');
    const [programasEducativos, setProgramasEducativos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrograma, setSelectedPrograma] = useState(null); // Programa seleccionado para modificar
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await fetch('http://10.11.80.111:8000/api/programas-educativos');
                const data = await response.json();
                setProgramasEducativos(data);
            } catch (e) {
                setError('Error al cargar los programas educativos.');
            }
        };

        fetchProgramas();
    }, []);

    const handleAddPrograma = async () => {
        const datosAEnviar = [
            {
                programa_educativo: nombre // El nombre debe ser el valor del campo de entrada
            }
        ];

        try {
            const response = await fetch('http://10.11.80.111:8000/api/programa-educativo', {
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
                setNombre(''); // Limpiar el campo después de añadir el programa
                setTimeout(() => {
                    setSuccess(false);
                    setActiveView('none');
                }, 3000);
            }
        } catch (e) {
            setError('Ha ocurrido un error al agregar el programa educativo.');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredProgramas = searchTerm
        ? programasEducativos.filter((programa) =>
            programa.programa_educativo.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : programasEducativos;

    const handleSelectPrograma = (programa) => {
        setSelectedPrograma(programa);
        setNombre(programa.programa_educativo);
    };

    const handleUpdatePrograma = async () => {
        if (!selectedPrograma) return;

        const datosAEnviar = { programa_educativo: nombre };

        try {
            const response = await fetch(`http://10.11.80.111:8000/api/programa-educativo/${selectedPrograma.id_programa_educativo}`, {
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
                    setSelectedPrograma(null);
                    setNombre('');
                }, 3000);

                // Recargar los programas
                const updatedResponse = await fetch('http://10.11.80.111:8000/api/programas-educativos');
                const updatedData = await updatedResponse.json();
                setProgramasEducativos(updatedData);
            }
        } catch (e) {
            setError('Ha ocurrido un error al actualizar el programa educativo.');
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
                    Añadir Nuevo Programa Educativo
                </button>
                <button
                    className={`btn ${activeView === 'search' ? 'btn-active' : ''}`}
                    onClick={() => setActiveView(activeView === 'search' ? 'none' : 'search')}
                >
                    Buscar o Modificar Programas Educativos
                </button>
            </div>

            {activeView === 'add' && (
                <div className="form-container">
                    <h3 className="form-title">Añadir Nuevo Programa Educativo</h3>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del Programa Educativo</label>
                        <input
                            type="text"
                            id="nombre"
                            className="input"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>

                    <button className="btn" onClick={handleAddPrograma}>
                        Crear Programa Educativo
                    </button>
                </div>
            )}

            {activeView === 'search' && (
                <div className="search-section">
                    <h3 className="search-title">Buscar Programa Educativo</h3>

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
                                        onClick={() => handleSelectPrograma(programa)}
                                        className="bachillerato-item"
                                    >
                                        {programa.programa_educativo}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {selectedPrograma && (
                        <div className="modify-form">
                            <h4>Modificar Programa Educativo Seleccionado</h4>

                            <div className="form-group">
                                <label htmlFor="nombre">Nombre del Programa Educativo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                />
                            </div>

                            <button className="btn" onClick={handleUpdatePrograma}>
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

export default ProgramaEducativoManagement;
