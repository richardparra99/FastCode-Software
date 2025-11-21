import axios from "axios";

/**
 * Configurar interceptores de Axios para manejo automático de autenticación
 */
const setupAxiosInterceptors = (navigate) => {
  // Interceptor de respuestas
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Si recibimos un error 401 (No autorizado), redirigir al login
      if (error.response && error.response.status === 401) {
        // Limpiar datos de autenticación
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        // Redirigir al login
        if (navigate) {
          navigate("/login", { replace: true });
        } else {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );

  // Interceptor de peticiones para agregar el token automáticamente
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;
