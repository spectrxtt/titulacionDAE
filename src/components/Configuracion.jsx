import React, { useState } from 'react';
import { Users, Palette, ExternalLink } from 'lucide-react';
import '../styles/configuracion.css';

// Componente para el formulario de crear nuevo usuario
const CrearUsuarioFormulario = ({ onClose }) => {
    const [nombre_usuario, setNombre] = useState('');
    const [usuario, setUsuario] = useState(''); // Este es el campo para el nombre de usuario
    const [contrasena, setContrasena] = useState('');
    const [rol, setRol] = useState('');
    const [mensaje, setMensaje] = useState(''); // Estado para manejar el mensaje

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            nombre_usuario: usuario, // Mapeando correctamente el campo para la base de datos
            contrasena,
            rol,
        };

        try {
            console.log(JSON.stringify(data)); // Verifica los datos antes de enviarlos

            const response = await fetch('http://127.0.0.1:8000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setMensaje('Usuario creado exitosamente'); // Mensaje de éxito
                setNombre('');
                setUsuario('');
                setContrasena('');
                setRol('');

                // Cierra el formulario después de enviar
                onClose();
            } else {
                const errorData = await response.text(); // Si no es JSON, obtenemos texto
                throw new Error(errorData || 'Error al crear el usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            setMensaje(`Error: ${error.message}`); // Mensaje de error
        }
    };

    return (
        <div className="formulario-usuario">
            <h4>Crear Nuevo Usuario</h4>
            {mensaje && <p>{mensaje}</p>} {/* Mostrar mensaje si existe */}
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
                <button type="submit" className="btn">Crear Usuario</button>
                <button type="button" className="btn" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
};

const GestionUsuarios = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    return (
        <div>
            <h3>Gestión de Usuarios</h3>
            <button className="btn" onClick={() => setMostrarFormulario(true)}>Crear nuevo usuario</button>
            <button className="btn">Modificar usuario existente</button>
            <button className="btn">Eliminar usuario</button>
            {mostrarFormulario && (
                <CrearUsuarioFormulario onClose={() => setMostrarFormulario(false)} />
            )}
        </div>
    );
};

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
