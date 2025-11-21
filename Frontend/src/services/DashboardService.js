import axios from "axios";

const API_URL = "http://localhost:3000/api/dashboard";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const obtenerEstadisticas = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/estadisticas`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error.response?.data || error.message;
  }
};

export { obtenerEstadisticas };
export default { obtenerEstadisticas };
