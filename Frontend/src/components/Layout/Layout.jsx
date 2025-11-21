import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import "./Layout.css";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const usuario = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate("/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: "📊",
    },
    {
      title: "Clientes",
      path: "/clientes",
      icon: "👥",
    },
    {
      title: "Productos",
      path: "/productos",
      icon: "🍞",
    },
    {
      title: "Facturación",
      path: "/facturacion",
      icon: "🧾",
    },
    {
      title: "Contabilidad",
      path: "/contabilidad",
      icon: "💰",
    },
  ];

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🥖</span>
            {sidebarOpen && <span className="logo-text">SIGEPAN</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-text">{item.title}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="toggle-btn"
            title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h2 className="page-title">
              {menuItems.find((item) => item.path === location.pathname)
                ?.title || "Dashboard"}
            </h2>
          </div>

          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {usuario?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {usuario?.username || "Usuario"}
                </span>
                <span className="user-role">{usuario?.rol || "ADMIN"}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-outline btn-sm logout-btn"
            >
              Cerrar Sesión
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
