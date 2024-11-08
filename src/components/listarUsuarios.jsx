import React, { useState, useEffect } from 'react';

// Componente para listar y gestionar usuarios
const ListaUsuarios = ({ onEdit, onDelete }) => {
    const [usuarios, setUsuarios] = useState([]);

    // Obtener los usuarios de la API
    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await fetch('http://10.11.80.167:8000/api/usuarios');
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
            }
        };

        fetchUsuarios();
    }, []);

    return (
        <div>
            <h4>Lista de Usuarios</h4>
            {usuarios.length === 0 ? (
                <p>No hay usuarios disponibles.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.nombre_usuario}</td>
                            <td>{usuario.usuario}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <button onClick={() => onEdit(usuario)}>Modificar</button>
                                <button onClick={() => onDelete(usuario.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListaUsuarios;
