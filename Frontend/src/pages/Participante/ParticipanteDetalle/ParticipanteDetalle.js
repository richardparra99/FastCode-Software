import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { addWishlistItem, getParticipanteByToken } from "../../../../services/ParticipanteService";

export const useParticipanteDetalle = () => {
    const { token } = useParams();
    
    const [participante, setParticipante] = useState(null);
    const [participanteAsignado, setParticipanteAsignado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para agregar wishlist
    const [showAddWishlist, setShowAddWishlist] = useState(false);
    const [nuevoDeseo, setNuevoDeseo] = useState("");

    const fetchParticipante = () => {
        setLoading(true);
        setError(null);
        getParticipanteByToken(token)
            .then((data) => {
                setParticipante(data.participante);
                setParticipanteAsignado(data.participanteAsignado);
            })
            .catch((err) => {
                console.error("Error al cargar participante:", err);
                setError(err.message || "Error al cargar el participante");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (token) {
            fetchParticipante();
        }
        // eslint-disable-next-line
    }, [token]);

    const handleAddWishlist = async () => {
        if (!nuevoDeseo.trim()) {
            alert("Por favor ingresa un deseo");
            return;
        }

        try {
            await addWishlistItem(token, [nuevoDeseo]);
            setNuevoDeseo("");
            setShowAddWishlist(false);
            fetchParticipante(); // Recargar datos
            alert("Deseo agregado exitosamente");
        } catch (err) {
            console.error("Error al agregar deseo:", err);
            alert("Error al agregar el deseo");
        }
    };

    return {
        participante,
        participanteAsignado,
        loading,
        error,
        showAddWishlist,
        setShowAddWishlist,
        nuevoDeseo,
        setNuevoDeseo,
        handleAddWishlist
    };
};