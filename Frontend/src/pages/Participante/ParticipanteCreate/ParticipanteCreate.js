import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createParticipante } from "../../../../services/ParticipanteService";

export const useInscripcionForm = () => {
    const navigate = useNavigate();
    const { link } = useParams();
    
    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [codigoGenerado, setCodigoGenerado] = useState(null);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(true);
        
        const participante = { nombre };
        sendInscripcion(participante);
    };

    const sendInscripcion = (participante) => {
        createParticipante(link, participante)
            .then((response) => {
                // const token = response.participante.linkParticipante.split('/').pop();
                // navigate(`/participantes/${token}`);
                setCodigoGenerado(response.participante.identificadorUnico)
            })
            .catch((error) => {
                console.error("Error al inscribirse:", error);
                alert("Error al inscribirte al sorteo. Intenta nuevamente.");
            });
    };

    const handleCancel = () => {
        navigate(`/sorteo/${link}`);
    };

    return {
        // Estado
        validated,
        nombre,
        codigoGenerado,
        
        // Manejadores de estado
        setNombre,
        
        // Manejadores de eventos
        handleSubmit,
        handleCancel
    };
};