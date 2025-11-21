import axios from "axios";
const createParticipante = (link, participante) => {
    return new Promise((resolve, reject) => {

        axios.post(`http://localhost:3000/participantes/${link}`, participante, {
        })
            .then((response) => {
                const nuevoParticipante = response.data;
                resolve(nuevoParticipante);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const getParticipanteByToken = (linkParticipante) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:3000/participantes/${linkParticipante}`, 
            
        )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const addWishlistItem = (token, wishlist) => {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/participantes/${token}/wishlist`, { wishlist })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

const loginParticipante = (link, identificadorUnico) => {
    return new Promise((resolve, reject) => {
        axios.post(`http://localhost:3000/sorteos/${link}/participantes/login`, { identificadorUnico })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export { createParticipante, getParticipanteByToken, addWishlistItem, loginParticipante };