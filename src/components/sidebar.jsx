import React, { useState } from 'react';
import '../styles/sidebar.css';
import logo from '../img/garza (2).png';

const Sidebar = ({ onComponentChange, onProfileClick, onLogout, userRole, userNombre }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClick = (components) => {
        if (components[0] === 'CerrarSesion') {
            onLogout(); // Llama a la función de cierre de sesión
        } else {
            onComponentChange(components); // Cambia el componente
        }
    };

    // Función para renderizar los botones según el rol del usuario
    const renderButtons = () => {
        switch (userRole) {
            case 'admin':
                return (
                    <>
                        {/* Botones para el rol admin */}
                        <li>
                            <button onClick={() => handleClick(['Inicio'])}>
                                <i className="fa-solid fa-house"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Inicio'])}>Inicio</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Citas'])}>
                                <i className="fa-solid fa-clock"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Citas'])}>Citas</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Integracion'])}>
                                <i className="fa-solid fa-book"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Integracion'])}>Integración</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Expedientes'])}>
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Expedientes'])}>Expedientes</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Configuracion'])}>
                                <i className="fa-solid fa-gear"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Configuracion'])}>Configuración</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['CerrarSesion'])}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['CerrarSesion'])}>Cerrar Sesión</button>
                            </span>
                        </li>
                    </>
                );

            case 'impresion':
                return (
                    <>
                        {/* Botones para el rol impresion */}
                        <li>
                            <button onClick={() => handleClick(['Inicio'])}>
                                <i className="fa-solid fa-house"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Inicio'])}>Inicio</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Citas'])}>
                                <i className="fa-solid fa-clock"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Citas'])}>Citas</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Integracion'])}>
                                <i className="fa-solid fa-book"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Integracion'])}>Integración</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Expedientes'])}>
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Expedientes'])}>Expedientes</button>
                            </span>
                        </li>

                        <li>
                            <button onClick={() => handleClick(['Configuracion'])}>
                                <i className="fa-solid fa-gear"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Configuracion'])}>Configuración</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['CerrarSesion'])}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['CerrarSesion'])}>Cerrar Sesión</button>
                            </span>
                        </li>
                    </>
                );

            case 'integrador':
                return (
                    <>
                        {/* Botones para el rol integrador */}
                        <li>
                            <button onClick={() => handleClick(['Inicio'])}>
                                <i className="fa-solid fa-house"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Inicio'])}>Inicio</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Integracion'])}>
                                <i className="fa-solid fa-book"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Integracion'])}>Integración</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Expedientes'])}>
                                <i className="fa-solid fa-pen"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Expedientes'])}>Expedientes</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['Configuracion'])}>
                                <i className="fa-solid fa-gear"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['Configuracion'])}>Configuración</button>
                            </span>
                        </li>
                        <li>
                            <button onClick={() => handleClick(['CerrarSesion'])}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                            </button>
                            <span className={isOpen ? '' : 'hidden'}>
                                <button onClick={() => handleClick(['CerrarSesion'])}>Cerrar Sesión</button>
                            </span>
                        </li>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <ul>
                <div className={"perfil"}>
                    {isOpen && (
                        <div className={"dataDAE"}>
                            <span>Dirección de Administración Escolar</span>
                            <span>Área de Titulación</span>
                        </div>
                    )}
                </div>
                <li>
                    <div className={"perfil"} onClick={onProfileClick}>
                        <img src={logo} alt="logo_uaeh" className="logoG" />
                        <div className={"dataPerfilInicio"}>
                            <span>
                                {/* Mostrar el nombre del usuario en lugar del rol */}
                                { userNombre &&  userNombre.length > 0
                                    ? userNombre // Asegúrate de que 'nombre_usuario' es el nombre correcto
                                    : 'Usuario Desconocido' // Valor por defecto si nombre_usuario no es válido
                                }
                            </span>
                            <span>
                                {/* Mostrar el rol del usuario */}
                                {typeof userRole === 'string' && userRole.length > 0
                                    ? userRole.charAt(0).toUpperCase() + userRole.slice(1)
                                    : 'Invitado' // Valor por defecto si userRole no es válido
                                }
                            </span>
                        </div>
                    </div>
                </li>
                {/* Renderizar los botones según el rol */}
                {renderButtons()}
            </ul>
            <button className={"openSide"} onClick={toggleSidebar}>
                {isOpen ? <i className="fa-solid fa-chevron-left"></i> : <i className="fa-solid fa-chevron-right"></i>}
            </button>
        </div>
    );
};

export default Sidebar;
