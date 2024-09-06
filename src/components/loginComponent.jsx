import '../styles/App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/garza (2).png';
import usuarios from '../pruebas/dataUsuarios';

function LoginComponent() {
    const [usuario, setUsuario] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const usuarioEncontrado = usuarios.find(
            u => u.usuario === usuario && u.contraseña === contraseña
        );

        if (usuarioEncontrado) {
            navigate('home');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="container">
            <div className="logo">
                <img src={logo} alt="logo_uaeh" className="logoLogin"/>
            </div>

            <div className="login">
                <div className="form-container">
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="usuario">Usuario</label>
                            <input
                                type="text"
                                id="usuario"
                                name="Usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input
                                type="password"
                                id="contraseña"
                                name="Contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                        </div>
                        {error && <p className="error">{error}</p>}
                        <div className="boton_inicioS">
                            <button type="submit">Iniciar sesión</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;
