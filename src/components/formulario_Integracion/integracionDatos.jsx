import { createContext, useContext, useState } from 'react';

// Crea el contexto para el estado del formulario
const FormDataContext = createContext();

// Hook para usar el contexto del formulario
export const useFormData = () => useContext(FormDataContext);

// Proveedor del contexto del formulario
export const FormDataProvider = ({ children }) => {
    const [formData, setFormData] = useState({});

    // Función para actualizar el estado del formulario
    const updateFormData = (data) => {
        setFormData(prevData => ({ ...prevData, ...data }));
    };

    return (
        <FormDataContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormDataContext.Provider>
    );
};
