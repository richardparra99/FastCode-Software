import axios from "axios";

const API_URL = "http://localhost:3000/api/facturas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const FacturacionService = {
  /**
   * Crear nueva factura
   */
  async crearFactura(datosFactura) {
    try {
      const response = await axios.post(
        API_URL,
        datosFactura,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error al crear factura:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener todas las facturas
   */
  async obtenerFacturas(filtros = {}) {
    try {
      const params = new URLSearchParams();

      if (filtros.estado) params.append("estado", filtros.estado);
      if (filtros.clienteId) params.append("cliente_id", filtros.clienteId);
      if (filtros.metodoPago) params.append("metodo_pago", filtros.metodoPago);
      if (filtros.fechaInicio)
        params.append("fecha_inicio", filtros.fechaInicio);
      if (filtros.fechaFin) params.append("fecha_fin", filtros.fechaFin);

      const url = params.toString() ? `${API_URL}?${params}` : API_URL;
      const response = await axios.get(url, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener factura por ID
   */
  async obtenerFacturaPorId(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error al obtener factura:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar estado de factura
   */
  async actualizarEstado(id, estado) {
    try {
      const response = await axios.patch(
        `${API_URL}/${id}/estado`,
        { estado },
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Anular factura
   */
  async anularFactura(id) {
    try {
      const response = await axios.post(
        `${API_URL}/${id}/anular`,
        {},
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error al anular factura:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener reporte de ventas
   */
  async obtenerReporteVentas(fechaInicio, fechaFin, agruparPor = "dia") {
    try {
      const response = await axios.get(`${API_URL}/reportes/ventas`, {
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          agrupar_por: agruparPor,
        },
        ...getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte de ventas:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener ventas por cliente
   */
  async obtenerVentasPorCliente(fechaInicio, fechaFin) {
    try {
      const response = await axios.get(`${API_URL}/reportes/por-cliente`, {
        params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin },
        ...getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener ventas por cliente:", error);
      throw error.response?.data || error;
    }
  },
};

export default FacturacionService;
