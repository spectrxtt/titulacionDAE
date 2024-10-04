import React, { useState, useEffect } from 'react';
import { Users, Palette, ExternalLink } from 'lucide-react';
import '../styles/configuracion.css';

// Componente para el formulario de crear o modificar usuario
const CrearUsuarioFormulario = ({ onClose, usuarioExistente }) => {
    const [nombre_usuario, setNombre] = useState(usuarioExistente ? usuarioExistente.nombre_usuario : '');
    const [usuario, setUsuario] = useState(usuarioExistente ? usuarioExistente.usuario : ''); // Este es el campo para el nombre de usuario
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState(usuarioExistente ? usuarioExistente.rol : '');
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            nombre_usuario,
            usuario,
            contrasena,
            rol,
        };

        try {
            const url = usuarioExistente
                ? `http://127.0.0.1:8000/api/usuarios/${usuarioExistente.id_usuario}` // Cambia a id_usuario
                : 'http://127.0.0.1:8000/api/usuarios';

            const response = await fetch(url, {
                method: usuarioExistente ? 'PUT' : 'POST', // Usar PUT si es modificación
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setMensaje(usuarioExistente ? 'Usuario modificado exitosamente' : 'Usuario creado exitosamente');
                onClose();
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Error al crear/modificar el usuario');
            }
        } catch (error) {
            setMensaje(`Error: ${error.message}`);
        }
    };

    return (
        <div className="formulario-usuario">
            <h4>{usuarioExistente ? 'Modificar Usuario' : 'Crear Nuevo Usuario'}</h4>
            {mensaje && <p>{mensaje}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre:</label>
                    <input type="text" value={nombre_usuario} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Usuario:</label>
                    <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Contraseña:</label>
                    <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Rol:</label>
                    <select value={rol} onChange={(e) => setRol(e.target.value)} required>
                        <option value="">Seleccione un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="usuario">Impresion</option>
                        <option value="editor">Integrador</option>
                    </select>
                </div>
                <button type="submit" className="btn">{usuarioExistente ? 'Modificar Usuario' : 'Crear Usuario'}</button>
                <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
};

const GestionUsuarios = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarUsuarios, setMostrarUsuarios] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const obtenerUsuarios = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/usuarios');
            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const handleModificarUsuario = () => {
        setMostrarUsuarios(true);
        obtenerUsuarios(); // Solo obtener usuarios al hacer clic en "Modificar usuario"
    };

    const handleSeleccionarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setMostrarFormulario(true);
    };

    const handleEliminarUsuario = async (id_usuario) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/usuarios/${id_usuario}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Usuario eliminado exitosamente');
                obtenerUsuarios(); // Volver a cargar la lista de usuarios
            } else {
                throw new Error('Error al eliminar el usuario');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    };

    return (
        <div>
            <h3>Gestión de Usuarios</h3>
            <button className="btn" onClick={() => setMostrarFormulario(true)}>Crear nuevo usuario</button>
            <button className="btn" onClick={handleModificarUsuario}>Modificar usuario existente</button>

            {mostrarUsuarios && usuarios.length > 0 && (
                <div>
                    <h4>Usuarios Existentes:</h4>
                    <ul>
                        {usuarios.map((usuario) => (
                            <li key={usuario.id_usuario}>
                                {usuario.nombre_usuario} - {usuario.rol}
                                <button onClick={() => handleSeleccionarUsuario(usuario)}>Modificar</button>
                                <button onClick={() => handleEliminarUsuario(usuario.id_usuario)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {mostrarFormulario && (
                <CrearUsuarioFormulario
                    onClose={() => {
                        setMostrarFormulario(false);
                        setUsuarioSeleccionado(null);
                    }}
                    usuarioExistente={usuarioSeleccionado}
                />
            )}
        </div>
    );
};

// Los otros componentes para apariencia y configuraciones externas siguen igual
const ConfiguracionApariencia = () => (
    <div>
        <h3>Configuración de Apariencia</h3>
        <div className="form-group">
            <label>Tema:</label>
            <select className="select">
                <option>Claro</option>
                <option>Oscuro</option>
            </select>
        </div>
        <div className="form-group">
            <label>Color primario:</label>
            <input type="color" className="color-picker" />
        </div>
    </div>
);

const ConfiguracionAplicaciones = () => (
    <div>
        <h3>Configuración de Aplicaciones Externas</h3>
        <div className="form-group">
            <label>API Key:</label>
            <input type="text" className="input" placeholder="Ingrese API Key" />
        </div>
        <button className="btn">Conectar aplicación externa</button>
    </div>
);

const Configuracion = () => {
    const [seccionActiva, setSeccionActiva] = useState('usuarios');

    const renderSeccion = () => {
        switch(seccionActiva) {
            case 'usuarios':
                return <GestionUsuarios />;
            case 'apariencia':
                return <ConfiguracionApariencia />;
            case 'aplicaciones':
                return <ConfiguracionAplicaciones />;
            default:
                return <div>Seleccione una opción</div>;
        }
    };

    return (
        <div className="configuracion-container">
            <div className="menu-lateral">
                <button
                    className={`menu-item ${seccionActiva === 'usuarios' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('usuarios')}
                >
                    <Users size={20} />
                    Gestión de Usuarios
                </button>
                <button
                    className={`menu-item ${seccionActiva === 'apariencia' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('apariencia')}
                >
                    <Palette size={20} />
                    Configuración de Apariencia
                </button>
                <button
                    className={`menu-item ${seccionActiva === 'aplicaciones' ? 'active' : ''}`}
                    onClick={() => setSeccionActiva('aplicaciones')}
                >
                    <ExternalLink size={20} />
                    Configuración de Aplicaciones Externas
                </button>
            </div>
            <div className="contenido-configuracion">
                {renderSeccion()}
            </div>
        </div>
    );
};

export default Configuracion;
