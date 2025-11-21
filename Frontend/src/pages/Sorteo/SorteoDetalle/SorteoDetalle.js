import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthentication from "../../../../hooks/useAuthentication";
import { deshabilitarSorteo, getSorteoByLink, habilitarSorteo, realizarSorteo } from "../../../../services/SorteoService";
import { loginParticipante } from "../../../../services/ParticipanteService";

export const useSorteoDetalle = () => {
    const { link } = useParams();
    const { username } = useAuthentication(false);
    
    const [sorteo, setSorteo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [participanteData, setParticipanteData] = useState(null);


    const fetchSorteoDetalle = () => {
        setLoading(true);
        setError(null);
        getSorteoByLink(link)
            .then((data) => {
                setSorteo(data);
            })
            .catch((err) => {
                console.error("Error al cargar el sorteo:", err);
                setError(err.message || "Error al cargar el sorteo");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (link) {
            fetchSorteoDetalle();
        }
        // eslint-disable-next-line
    }, [link]);

    const handleHabilitar = async () => {
        habilitarSorteo(sorteo.link)
            .then(() => {
                setSorteo({ ...sorteo, estado: true });
            })
            .catch((err) => {
                console.error(err);
                alert("Error al habilitar el sorteo");
            });
    };

    const handleDeshabilitar = async () => {
        deshabilitarSorteo(sorteo.link)
            .then(() => {
                setSorteo({ ...sorteo, estado: false });
            })
            .catch((err) => {
                console.error(err);
                alert("Error al deshabilitar el sorteo");
            });
    };

    const handleSortear = async () => {

        try {
            await realizarSorteo(sorteo.id);
            alert(`¡Sorteo realizado!`);
            fetchSorteoDetalle();
        } catch (err) {
            console.error(err);
            alert(err.request.response);
        }
    };

    const shareLink = () => {
        setCopied(false);
        setShowShare(true);
    };

    const handleCopyLink = async () => {
        const linkUrl = `${window.location.origin}/sorteo/${sorteo.link}`;
        try {
            await navigator.clipboard.writeText(linkUrl);
            setCopied(true);
        } catch (err) {
            console.error("No se pudo copiar el link", err);
            alert("No se pudo copiar el link al portapapeles");
        }
    };

    const handleInscribirse = () => {
        window.location.href = `/sorteo/${sorteo.link}/inscribirse`;
    };

    const handleVerAsignacion = () => {
        setShowLogin(true);
    };

    const handleLoginSubmit = async () => {
        try {
            const data = await loginParticipante(link, codigo);
            setParticipanteData(data);
            setShowLogin(false);
            setCodigo("");
        } catch (err) {
            alert(err.response?.data?.error || 'Error al autenticar');
        }
    };

    return {
        // Estado
        sorteo,
        loading,
        error,
        showShare,
        setShowShare,
        copied,
        username,
        showLogin,
        setShowLogin,
        codigo,
        setCodigo,
        participanteData,

        shareLink,
        handleHabilitar,
        handleDeshabilitar,
        handleSortear,
        handleCopyLink,
        handleInscribirse,
        handleVerAsignacion,
        handleLoginSubmit,
    };
};