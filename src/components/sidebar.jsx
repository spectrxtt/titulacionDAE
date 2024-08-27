import React, { useState } from 'react';
import '../styles/sidebar.css';
import logo from '../img/garza (2).png';

const Sidebar = ({ onComponentChange }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClick = (components) => {
        onComponentChange(components);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <ul>
                <li>
                    <div className={"perfil"}>
                        <img src={logo} alt="logo_uaeh" className="logoG"/>
                        <div className={"dataPerfilInicio"}>
                            <span>Usuario</span>
                            <span>ROL</span>
                        </div>
                    </div>
                </li>
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
                        <button onClick={() => handleClick(['Integracion'])}>Integracion</button>
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
                    <button onClick={() => handleClick(['Reportes'])}>
                        <i className="fa-solid fa-chart-simple"></i>
                    </button>
                    <span className={isOpen ? '' : 'hidden'}>
                        <button onClick={() => handleClick(['Reportes'])}>Reportes</button>
                    </span>
                </li>
                <li>
                    <button onClick={() => handleClick(['Configuracion'])}>
                        <i className="fa-solid fa-gear"></i>
                    </button>
                    <span className={isOpen ? '' : 'hidden'}>
                        <button onClick={() => handleClick(['Configuracion'])}>Configuracion</button>
                    </span>
                </li>
                <li>
                    <button onClick={() => handleClick(['CerrarSesion'])}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                    <span className={isOpen ? '' : 'hidden'}>
                        <button onClick={() => handleClick(['CerrarSesion'])}>Cerrar Sesion</button>
                    </span>
                </li>
            </ul>
            <button className={"openSide"} onClick={toggleSidebar}>
                {isOpen ? <i className="fa-solid fa-chevron-left"></i> : <i className="fa-solid fa-chevron-right"></i>}
            </button>
        </div>
    );
};

export default Sidebar;
