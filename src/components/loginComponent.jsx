import '../styles/App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/garza (2).png';
import axios from 'axios'; // Asegúrate de tener axios instalado

function LoginComponent({ onLogin }) {
    const [usuario, setUsuario] = useState('');
    const [password, setpassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login', { usuario, password });

            // Login exitoso
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user)); // Asegúrate que 'user' contiene el rol
            onLogin(response.data.user); // Pasa el objeto usuario completo, que debería incluir el rol
            navigate('/home');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Usuario o contraseña incorrectos');
            } else {
                setError('Error al iniciar sesión. Por favor, intente de nuevo.');
            }
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
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="Contraseña"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
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
