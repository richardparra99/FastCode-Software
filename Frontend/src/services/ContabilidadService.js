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

const obtenerPlanCuentas = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/plan-cuentas`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener plan de cuentas:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerLibroDiario = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${API_URL}/libro-diario`, {
      ...getAuthHeaders(),
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener libro diario:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerBalanceGeneral = async (fecha) => {
  try {
    const response = await axios.get(`${API_URL}/balance-general`, {
      ...getAuthHeaders(),
      params: { fecha },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener balance general:", error);
    throw error.response?.data || error.message;
  }
};

const obtenerEstadoResultados = async (fechaInicio, fechaFin) => {
  try {
    const response = await axios.get(`${API_URL}/estado-resultados`, {
      ...getAuthHeaders(),
      params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
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
    console.error("Error al crear asiento contable:", error);
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
