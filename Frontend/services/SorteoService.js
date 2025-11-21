import axios from "axios";
import { getAccessToken } from "../utils/TokenUtilities";

const getAllSorteos = () => {
    return new Promise((resolve, reject) => {
        axios.get("http://localhost:3000/usuarios/sorteo", {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getSorteoById = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:3000/sorteos/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then((response) => {
                const docente = response.data;
                resolve(docente);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}
const createSorteo = (sorteo) => {
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:3000/sorteos", sorteo, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then((response) => {
                const nuevoDocente = response.data;
                resolve(nuevoDocente);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}
const updateSorteo = (id, sorteo) => {
    return new Promise((resolve, reject) => {
        axios.put(`http://localhost:3000/sorteos/${id}`, sorteo, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then((response) => {
                const updatedDocente = response.data;
                resolve(updatedDocente);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}
const deleteSorteo = (id) => {
    return new Promise((resolve, reject) => {
        axios.delete(`http://localhost:3000/sorteos/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}


const habilitarSorteo = (link) => {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/sorteos/${link}/habilitar`, {}, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const deshabilitarSorteo = (link) => {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/sorteos/${link}/deshabilitar`, {}, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const realizarSorteo = (id) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:3000/participantes/sorteo/${id}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getSorteoByLink = (link) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:3000/sorteos/${link}`)
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export { getSorteoById, createSorteo, updateSorteo, getAllSorteos, deleteSorteo, habilitarSorteo, deshabilitarSorteo, realizarSorteo, getSorteoByLink };