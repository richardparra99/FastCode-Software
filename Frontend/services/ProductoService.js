import axios from "axios";

const API_URL = "http://localhost:3000/api/productos";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const obtenerTodos = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error.response?.data || error.message;
  }
};

const crear = async (productoData) => {
  try {
    const response = await axios.post(API_URL, productoData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error.response?.data || error.message;
  }
};

const actualizar = async (id, productoData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      productoData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error.response?.data || error.message;
  }
};

const eliminar = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error.response?.data || error.message;
  }
};

const activar = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/${id}/activar`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al activar producto:", error);
    throw error.response?.data || error.message;
  }
};

export { obtenerTodos, obtenerPorId, crear, actualizar, eliminar, activar };
export default {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  activar,
};
