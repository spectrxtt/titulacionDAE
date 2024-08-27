import '../styles/App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/garza (2).png';

function LoginComponent() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // Aquí puedes agregar la lógica de autenticación si es necesario
        // Luego, navega a la nueva interfaz
        navigate('home');
    };

    return (
        <div className="container">
            <div className="logo">
                <img src={logo} alt="logo_uaeh" className="logoG"/>
            </div>

            <div className="login">
                <div className="form-container">
                    <form>
                        <div className="form-group">
                            <label htmlFor="usuario">Usuario</label>
                            <input type="text" id="usuario" name="Usuario"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input type="password" id="contraseña" name="Contraseña"/>
                        </div>
                    </form>
                    <div className="boton_inicioS">
                        <button onClick={handleLogin}>Iniciar sesión</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginComponent;