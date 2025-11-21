// hooks/useLoginForm.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthentication from "../../../../hooks/useAuthentication"; 

export const useLoginForm = () => {
    const navigate = useNavigate();
    const { doLogin } = useAuthentication(false);

    const [validated, setValidated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Renombrado a 'handleSubmit' para ser más genérico
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        
        // Si el formulario no es válido, solo muestra errores y detente
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        // Si es válido, marca como validado y envía
        setValidated(true);
        
        const loginData = { username, password };
        doLogin(loginData);
    };

    const handleCancel = () => {
        navigate("/");
    };

    // El hook devuelve "props" y "handlers" que la vista necesita
    return {
        // Estado
        validated,
        username,
        password,
        
        // Manejadores de estado
        setUsername,
        setPassword,
        
        // Manejadores de eventos
        handleSubmit,
        handleCancel
    };
};