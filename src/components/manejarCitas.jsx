import React, { createContext, useState, useContext } from 'react';

const CitasContext = createContext();

export const CitasProvider = ({ children }) => {
    const [citas, setCitas] = useState([]);

    const actualizarCitas = (nuevasCitas) => {
        setCitas(nuevasCitas);
    };

    return (
        <CitasContext.Provider value={{ citas, actualizarCitas }}>
            {children}
        </CitasContext.Provider>
    );
};

export const useCitas = () => useContext(CitasContext);