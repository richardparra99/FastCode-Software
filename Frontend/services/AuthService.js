import axios from "axios";

const API_URL = "http://localhost:3000/api";

const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    if (response.data.exito && response.data.datos.token) {
      localStorage.setItem("token", response.data.datos.token);
      localStorage.setItem(
        "usuario",
        JSON.stringify(response.data.datos.usuario)
      );
    }
    return response.data;
  } catch (error) {
    console.error("Error en login:", error);
    throw error.response?.data || error.message;
  }
};

const register = async (registerData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, registerData);
    return response.data;
  } catch (error) {
    console.error("Error en registro:", error);
    throw error.response?.data || error.message;
  }
};

const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }
  } catch (error) {
    console.error("Error en logout:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  }
};

const getPerfil = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/auth/perfil`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    throw error.response?.data || error.message;
  }
};

const getCurrentUser = () => {
  const usuario = localStorage.getItem("usuario");
  return usuario ? JSON.parse(usuario) : null;
};

const getToken = () => {
  return localStorage.getItem("token");
};

const isAuthenticated = () => {
  return !!getToken();
};

export {
  login,
  register,
  logout,
  getPerfil,
  getCurrentUser,
  getToken,
  isAuthenticated,
};
export default {
  login,
  register,
  logout,
  getPerfil,
  getCurrentUser,
  getToken,
  isAuthenticated,
};
