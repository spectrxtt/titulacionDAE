import React, { useState } from 'react';
import '../styles/profileOptions.css';

const ProfileOptions = ({ onClose }) => {
    const [name, setName] = useState('Juan');
    const [surname, setSurname] = useState('Hernandez');
    const [passw, setpassw] = useState('juan.hernandez@example.com');

    const handleNameChange = (e) => setName(e.target.value);
    const handleSurnameChange = (e) => setSurname(e.target.value);
    const handlepassChange = (e) => setpassw(e.target.value);

    return (
        <div className="profile-container">

            <div className="profile-content">
                <h2>Mi perfil</h2>

                <div className="profile-image-section">
                    <img
                        src="profile-image-url"
                        alt="Profile"
                        className="profile-image"
                    />
                    <div className={'opcionesPerfil'} >
                        <button>Cambiar foto de perfil</button>
                        <button>Borrar</button>
                    </div>
                </div>

                <div className="profile-details-section">
                    <label>Nombre</label>
                    <input type="text" value={name} onChange={handleNameChange}/>

                    <label>Apellido</label>
                    <input type="text" value={surname} onChange={handleSurnameChange}/>

                    <label>Contraseña</label>
                    <input type="password" value={passw} onChange={handlepassChange}/>

                    <button className="save-button">Modificar</button>
                </div>
            </div>
        </div>
    );
};

export default ProfileOptions;
