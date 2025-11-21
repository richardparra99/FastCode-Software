import { useEffect, useState } from "react";
import AuthService from "../../services/AuthService";
import DashboardService from "../../services/DashboardService";
import "./Dashboard.css";

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);
  const [stats, setStats] = useState({
    clientes: 0,
    productos: 0,
    ventas: 0,
    ingresos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    setUsuario(currentUser);
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const response = await DashboardService.obtenerEstadisticas();
      if (response.exito) {
        setStats(response.datos);
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      setError("No se pudieron cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Clientes",
      value: stats.clientes,
      icon: "👥",
      color: "#3b82f6",
      description: "Total de clientes",
    },
    {
      title: "Productos",
      value: stats.productos,
      icon: "🍞",
      color: "#f59e0b",
      description: "Productos activos",
    },
    {
      title: "Ventas del Mes",
      value: stats.ventas,
      icon: "📈",
      color: "#10b981",
      description: "Transacciones",
    },
    {
      title: "Ingresos",
      value: `$${stats.ingresos.toLocaleString()}`,
      icon: "💰",
      color: "#8b5cf6",
      description: "Este mes",
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError("")} className="alert-close">
            ×
          </button>
        </div>
      )}

      <div className="welcome-section">
        <h1>¡Bienvenido, {usuario?.username || "Usuario"}! 👋</h1>
        <p className="text-muted">
          Este es tu panel de control. Aquí puedes ver un resumen de tu
          panadería.
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{ borderTopColor: stat.color }}
          >
            <div
              className="stat-icon"
              style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h2 className="stat-value">{stat.value}</h2>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Accesos Rápidos</h3>
            </div>
            <div className="quick-actions">
              <button
                className="action-btn"
                onClick={() => (window.location.href = "/clientes")}
              >
                <span className="action-icon">👥</span>
                <span>Gestionar Clientes</span>
              </button>
              <button
                className="action-btn"
                onClick={() => (window.location.href = "/productos")}
              >
                <span className="action-icon">🍞</span>
                <span>Gestionar Productos</span>
              </button>
              <button
                className="action-btn"
                onClick={() => (window.location.href = "/contabilidad")}
              >
                <span className="action-icon">💰</span>
                <span>Ver Contabilidad</span>
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Información del Sistema</h3>
            </div>
            <div className="system-info">
              <div className="info-row">
                <span className="info-label">Usuario:</span>
                <span className="info-value">{usuario?.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Rol:</span>
                <span className="badge badge-warning">
                  {usuario?.rol || "ADMIN"}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Estado:</span>
                <span className="badge badge-success">Activo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
