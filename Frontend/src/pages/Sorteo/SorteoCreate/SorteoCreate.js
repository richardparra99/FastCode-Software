import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSorteo, getSorteoById, updateSorteo } from "../../../../services/SorteoService";

export const useSorteoForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [validated, setValidated] = useState(false);
    const [nombre, setNombre] = useState("");
    const [fecha, setFecha] = useState("");

    useEffect(() => {
        if (!id) {
            return;
        }
        const fetchSorteo = () => {
            getSorteoById(id)
                .then((sorteo) => {
                    setNombre(sorteo.nombre || "");
                    const fechaFormateada = sorteo.fecha 
                        ? new Date(sorteo.fecha).toISOString().split('T')[0] 
                        : "";
                    setFecha(fechaFormateada);
                })
                .catch(() => {
                    alert("Error al cargar el sorteo");
                    navigate("/");
                });
        };
        fetchSorteo();
    }, [id, navigate]);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        setValidated(true);
        sendSorteoForm();
    };

    const sendSorteoForm = () => {
        const sorteo = {
            nombre,
            fecha
        };

        if (id) {
            sendSorteoUpdate(sorteo);
        } else {
            sendSorteoCreate(sorteo);
        }
    };

    const sendSorteoUpdate = (sorteo) => {
        updateSorteo(id, sorteo)
            .then((sorteoActualizado) => {
                console.log(sorteoActualizado);
                navigate("/");
            })
            .catch(() => {
                alert("Error al actualizar el sorteo");
            });
    };

    const sendSorteoCreate = (sorteo) => {
        createSorteo(sorteo)
            .then((nuevoSorteo) => {
                console.log(nuevoSorteo);
                navigate("/");
            })
            .catch(() => {
                alert("Error al crear el sorteo");
            });
    };

    const handleCancel = () => {
        navigate("/");
    };

    return {
        // Estado
        validated,
        nombre,
        fecha,
        
        // Manejadores de estado
        setNombre,
        setFecha,
        
        // Manejadores de eventos
        handleSubmit,
        handleCancel
    };
};