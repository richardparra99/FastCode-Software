import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import AuthService from "./services/AuthService";
import { AuthGuard } from "./hooks/useAuthCheck";
import setupAxiosInterceptors from "./utils/axiosInterceptor";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Clientes from "./pages/Clientes/Clientes";
import Productos from "./pages/Productos/Productos";
import Contabilidad from "./pages/Contabilidad/Contabilidad";
import Facturacion from "./pages/Facturacion/Facturacion";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Limpiar cualquier dato residual
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthGuard>
      <Layout>{children}</Layout>
    </AuthGuard>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Configurar interceptores de Axios
    setupAxiosInterceptors(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clientes"
        element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/productos"
        element={
          <ProtectedRoute>
            <Productos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contabilidad"
        element={
          <ProtectedRoute>
            <Contabilidad />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facturacion"
        element={
          <ProtectedRoute>
            <Facturacion />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
