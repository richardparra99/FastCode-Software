import axios from "axios";

const API_URL = "http://localhost:3000/api/clientes";

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
    console.error("Error al obtener clientes:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerPorId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    throw error.response?.data || error.message;
  }
};

const crear = async (clienteData) => {
  try {
    const response = await axios.post(API_URL, clienteData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error.response?.data || error.message;
  }
};

const actualizar = async (id, clienteData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      clienteData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    throw error.response?.data || error.message;
  }
};

const eliminar = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    throw error.response?.data || error.message;
  }
};

export { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
export default { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
