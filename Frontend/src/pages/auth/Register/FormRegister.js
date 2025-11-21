// hooks/useLoginForm.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../../services/AuthService";         

export const useRegisterForm = () => {
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        
        
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(true);

        const registerData = { nombre, username, password };
        register(registerData);
        navigate("/login");
    };

    const handleCancel = () => {
        navigate("/");
    };

    
    return {
        // Estado
        validated,
        username,
        password,
        
        // Manejadores de estado
        setNombre,
        setUsername,
        setPassword,
        
        // Manejadores de eventos
        handleSubmit,
        handleCancel
    };
};