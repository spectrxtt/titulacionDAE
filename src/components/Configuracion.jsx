import React, { useState } from 'react';
import { Users, Palette, ExternalLink } from 'lucide-react';
import '../styles/configuracion.css';

const GestionUsuarios = () => (
    <div>
        <h3>Gestión de Usuarios</h3>
        <button className="btn">Crear nuevo usuario</button>
        <button className="btn">Modificar usuario existente</button>
        <button className="btn">Eliminar usuario</button>
    </div>
);

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