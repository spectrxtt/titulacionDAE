import React, { useState, useEffect } from 'react';
import { Users, Palette, ExternalLink } from 'lucide-react';
import '../styles/configuracion.css';
import Bachilleratos from "./basesDatos/Bachilleratos";

// Componente para el formulario de crear o modificar usuario
const CrearUsuarioFormulario = ({ onClose, usuarioExistente }) => {
    const [nombre_usuario, setNombreCompleto] = useState('');
    const [usuario, setNombreUsuario] = useState('');
    const [rol, setRolUsuario] = useState('');
    const [password, setContraseña] = useState('');
    const [errorPassword, setErrorPassword] = useState('');

    useEffect(() => {
        if (usuarioExistente) {
            setNombreCompleto(usuarioExistente.nombre_usuario);
            setNombreUsuario(usuarioExistente.usuario);
            setRolUsuario(usuarioExistente.rol);
            setContraseña(''); // Vaciar el campo de la contraseña en el modo de edición
            setErrorPassword(''); // Limpiar el mensaje de error
        }
    }, [usuarioExistente]);

    const validarContraseña = (pass) => {
        // Expresión regular: mínimo 6 caracteres, solo letras y números
        const regex = /^[A-Za-z0-9]{6,}$/;
        return regex.test(pass);
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setContraseña(newPassword);

        // Validar la nueva contraseña
        if (newPassword && !validarContraseña(newPassword)) {
            setErrorPassword("La contraseña debe tener al menos 6 caracteres y solo contener letras y números (sin caracteres especiales ni 'ñ').");
        } else {
            setErrorPassword(''); // Limpiar el error si es válido
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar si se está creando un nuevo usuario
        if (!usuarioExistente) {
            if (!password || !validarContraseña(password)) {
                alert("La contraseña es obligatoria al crear un nuevo usuario y debe tener al menos 6 caracteres, sin caracteres especiales ni 'ñ'.");
                return;
            }
        }

        const usuarioData = {
            nombre_usuario: nombre_usuario,
            usuario: usuario,
            rol: rol,
            ...(password && { password: password }) // Solo incluir la contraseña si fue ingresada
        };

        try {
            const response = usuarioExistente
                ? await fetch(`http://10.11.80.188:8000/api/usuarios/${usuarioExistente.id_usuario}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(usuarioData),
                })
                : await fetch('http://10.11.80.188:8000/api/usuarios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(usuarioData),
                });

            if (response.ok) {
                alert(usuarioExistente ? 'Usuario modificado exitosamente' : 'Usuario creado exitosamente');
                onClose();
            } else {
                alert('Error al guardar el usuario');
            }
        } catch (error) {
            console.error('Error al enviar los datos del usuario:', error);
            alert('Hubo un error al enviar los datos');
        }
    };

    return (
        <div className="formulario-container">
            <h4>{usuarioExistente ? 'Modificar Usuario' : 'Crear Nuevo Usuario'}</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                        type="text"
                        className="input"
                        value={nombre_usuario}
                        onChange={(e) => setNombreCompleto(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Usuario</label>
                    <input
                        type="text"
                        className="input"
                        value={usuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Contraseña {usuarioExistente && '(Opcional al modificar)'}</label>
                    <input
                        type="password"
                        className="input"
                        value={password}
                        onChange={handlePasswordChange} // Cambia aquí para usar la nueva función
                        placeholder={usuarioExistente ? 'Dejar vacío para no cambiar' : 'Contraseña'}
                        {...(!usuarioExistente && { required: true })} // Solo requerida si es creación
                    />
                    {errorPassword && <p className="error">{errorPassword}</p>} {/* Mensaje de error */}
                </div>

                <div className="form-group">
                    <label>Rol</label>
                    <select
                        className="select"
                        value={rol}
                        onChange={(e) => setRolUsuario(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar rol</option>
                        <option value="admin">Administrador</option>
                        <option value="impresion">Impresion</option>
                        <option value="integrador">Integrador</option>
                    </select>
                </div>

                <button type="submit" className="btn">
                    {usuarioExistente ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
                <button type="button" className="btn" onClick={onClose}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};
const GestionUsuarios = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false); // Controla el formulario de creación
    const [mostrarUsuarios, setMostrarUsuarios] = useState(false); // Controla la tabla de usuarios
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const obtenerUsuarios = async () => {
        try {
            const response = await fetch('http://10.11.80.188:8000/api/usuarios');
            if (!response.ok) {
                throw new Error('Error al obtener usuarios');
            }
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    const handleCrearUsuario = () => {
        setMostrarFormulario(true); // Muestra el formulario de creación
        setMostrarUsuarios(false); // Oculta la tabla de usuarios existentes
        setUsuarioSeleccionado(null); // Asegúrate de que no haya ningún usuario seleccionado
    };

    const handleModificarUsuario = () => {
        setMostrarUsuarios(true); // Muestra la tabla de usuarios
        setMostrarFormulario(false); // Oculta el formulario de creación
        obtenerUsuarios(); // Obtener usuarios al hacer clic en "Modificar usuario"
    };

    const handleSeleccionarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario); // Selecciona un usuario para modificar
        setMostrarFormulario(true); // Muestra el formulario de creación con los datos del usuario
        setMostrarUsuarios(false); // Oculta la tabla de usuarios
    };

    const handleEliminarUsuario = async (id_usuario) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
        if (!confirmDelete) return; // Si el usuario cancela, no continuar

        try {
            const response = await fetch(`http://10.11.80.188:8000/api/usuarios/${id_usuario}`, {
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
            <button className="btn" onClick={handleCrearUsuario}>Crear nuevo usuario</button>
            <button className="btn" onClick={handleModificarUsuario}>Modificar usuario existente</button>

            {/* Tabla de usuarios, se muestra solo si mostrarUsuarios es true */}
            {mostrarUsuarios && usuarios.length > 0 && (
                <div>
                    <h4>Usuarios Existentes:</h4>
                    <table className="tabla-usuarios">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.nombre_usuario}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <button className="btn" onClick={() => handleSeleccionarUsuario(usuario)}>Modificar</button>
                                    <button className="btn eliminar" onClick={() => handleEliminarUsuario(usuario.id_usuario)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Formulario de creación o edición de usuario, se muestra solo si mostrarFormulario es true */}
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

const ConfiguracionAplicaciones = () => {
    const [showBachilleratoManagement, setShowBachilleratoManagement] = useState(false);

    return (
        <div>
            <div className="flex justify-between">
                <button className="btn" onClick={() => setShowBachilleratoManagement(true)}>
                    Bachilleratos
                </button>
                <button className="btn">Programas educativos</button>
                <button className="btn">Títulos Otorgados</button>
                <button className="btn">Modalidades de Titulación</button>
            </div>

            {showBachilleratoManagement && (
                <div className="mt-4">
                    <Bachilleratos />
                </div>
            )}
        </div>
    );
};


const Configuracion = ({ userRole }) => {
    const [seccionActiva, setSeccionActiva] = useState('usuarios');

    // Función que determina qué secciones mostrar dependiendo del rol
    const renderSeccion = () => {
        switch (seccionActiva) {
            case 'usuarios':
                return userRole === 'admin' ? <GestionUsuarios /> : <div>No tienes acceso a esta sección</div>;
            case 'apariencia':
                return <ConfiguracionApariencia />;
            case 'aplicaciones':
                return userRole !== 'integrador' ? <ConfiguracionAplicaciones /> : <div>No tienes acceso a esta sección</div>;
            default:
                return <div>Seleccione una opción</div>;
        }
    };

    // Función que determina qué botones mostrar en el menú lateral según el rol
    const renderMenuItems = () => {
        switch (userRole) {
            case 'admin':
                return (
                    <>
                        <button
                            className={`menu-item ${seccionActiva === 'usuarios' ? 'active' : ''}`}
                            onClick={() => setSeccionActiva('usuarios')}
                        >
                            <Users size={20} /> Gestión de Usuarios
                        </button>
                        <button
                            className={`menu-item ${seccionActiva === 'aplicaciones' ? 'active' : ''}`}
                            onClick={() => setSeccionActiva('aplicaciones')}
                        >
                            <ExternalLink size={20} /> Bases de datos
                        </button>
                    </>
                );
            case 'impresion':
                return (
                    <>
                        <button
                            className={`menu-item ${seccionActiva === 'aplicaciones' ? 'active' : ''}`}
                            onClick={() => setSeccionActiva('aplicaciones')}
                        >
                            <ExternalLink size={20} /> Bases de datos
                        </button>
                    </>
                );
            case 'integrador':
                return (
                    <button
                        className={`menu-item ${seccionActiva === 'apariencia' ? 'active' : ''}`}
                        onClick={() => setSeccionActiva('apariencia')}
                    >
                        <Palette size={20} /> Configuración de Apariencia
                    </button>
                );
            default:
                return null;
        }
    };

    return (
        <div className="configuracion-container">
            <div className="menu-lateral">
                {renderMenuItems()}
            </div>
            <div className="contenido-configuracion">
                {renderSeccion()}
            </div>
        </div>
    );
};


export default Configuracion;
