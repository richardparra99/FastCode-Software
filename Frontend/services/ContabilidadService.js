import axios from "axios";

const API_URL = "http://localhost:3000/api/contabilidad";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const obtenerPlanCuentas = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/plan-cuentas`, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener plan de cuentas:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerLibroDiario = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/libro-diario`, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener libro diario:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerBalanceGeneral = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/balance-general`, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener balance general:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerEstadoResultados = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/estado-resultados`, {
      ...getAuthHeaders(),
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener estado de resultados:", error);
    throw error.response?.data || error.message;
  }
};

const crearAsiento = async (asientoData) => {
  try {
    const response = await axios.post(
      `${API_URL}/asientos`,
      asientoData,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear asiento:", error);
    throw error.response?.data || error.message;
  }
};

export {
  obtenerPlanCuentas,
  obtenerLibroDiario,
  obtenerBalanceGeneral,
  obtenerEstadoResultados,
  crearAsiento,
};

export default {
  obtenerPlanCuentas,
  obtenerLibroDiario,
  obtenerBalanceGeneral,
  obtenerEstadoResultados,
  crearAsiento,
};
