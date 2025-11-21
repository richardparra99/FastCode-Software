import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/AuthService";

/**
 * Hook personalizado para verificar autenticación
 * Redirige al login si no hay token válido
 */
const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Solo verificar en rutas protegidas
    const rutasPublicas = ["/login", "/register"];
    if (rutasPublicas.includes(location.pathname)) {
      return;
    }

    // Verificar si está autenticado
    const isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
      // Limpiar datos y redirigir
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      navigate("/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  return AuthService.isAuthenticated();
};

/**
 * Componente de protección de rutas
 * Verifica automáticamente la autenticación en cada cambio de ruta
 */
const AuthGuard = ({ children }) => {
  const isAuthenticated = useAuthCheck();

  if (!isAuthenticated) {
    return null; // El hook ya maneja la redirección
  }

  return children;
};

export { useAuthCheck, AuthGuard };
export default useAuthCheck;
