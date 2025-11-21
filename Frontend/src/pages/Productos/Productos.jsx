import { useState, useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import "./Productos.css";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await ProductoService.obtenerTodos();
      if (response.exito) {
        setProductos(response.datos);
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      cargarProductos();
    } else {
      try {
        const response = await ProductoService.obtenerTodos({ buscar: term });
        if (response.exito) {
          setProductos(response.datos);
        }
      } catch (err) {
        console.error("Error en búsqueda:", err);
      }
    }
  };

  const handleOpenModal = (producto = null) => {
    if (producto) {
      setEditingProducto(producto);
      setFormData({
        name: producto.name,
        description: producto.description || "",
        price: producto.price,
      });
    } else {
      setEditingProducto(null);
      setFormData({
        name: "",
        description: "",
        price: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProducto(null);
    setFormData({
      name: "",
      description: "",
      price: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      const data = {
        ...formData,
        price: parseFloat(formData.price),
      };

      if (editingProducto) {
        response = await ProductoService.actualizar(editingProducto.id, data);
      } else {
        response = await ProductoService.crear(data);
      }

      if (response.exito) {
        cargarProductos();
        handleCloseModal();
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al guardar producto");
    }
  };

  // ✅ ÚNICO BOTÓN DE ESTADO (activar / desactivar soft)
  const handleToggleActive = async (producto) => {
    try {
      // Si está activo → desactivar (soft delete)
      if (producto.isActive) {
        if (!window.confirm("¿Desactivar este producto?")) return;
        const response = await ProductoService.eliminar(producto.id);
        if (!response.exito) setError(response.mensaje);
      }
      // Si está inactivo → activar
      else {
        const response = await ProductoService.activar(producto.id);
        if (!response.exito) setError(response.mensaje);
      }

      await cargarProductos();
    } catch (err) {
      setError("Error al cambiar estado del producto");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="productos-page">
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError("")} className="alert-close">
            ×
          </button>
        </div>
      )}

      <div className="page-header">
        <h2>Gestión de Productos</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          + Nuevo Producto
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="productos-grid">
          {productos.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted">No hay productos registrados</p>
            </div>
          ) : (
            productos.map((producto) => (
              <div key={producto.id} className="producto-card">
                <div className="producto-header">
                  <h3 className="producto-nombre">{producto.name}</h3>
                  <span
                    className={`badge ${producto.isActive ? "badge-success" : "badge-danger"
                      }`}
                  >
                    {producto.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {producto.description && (
                  <p className="producto-descripcion">{producto.description}</p>
                )}

                <div className="producto-info">
                  <div className="info-item">
                    <span className="info-label">Precio:</span>
                    <span className="info-value">
                      ${parseFloat(producto.price).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="producto-actions">
                  <button
                    onClick={() => handleOpenModal(producto)}
                    className="btn btn-sm btn-outline"
                    title="Editar"
                  >
                    ✏️ Editar
                  </button>

                  {/* ✅ Solo un botón para activar/desactivar */}
                  <button
                    onClick={() => handleToggleActive(producto)}
                    className={`btn btn-sm ${producto.isActive ? "btn-warning" : "btn-success"
                      }`}
                    title={producto.isActive ? "Desactivar" : "Activar"}
                  >
                    {producto.isActive ? "🔒 Desactivar" : "✓ Activar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="table-footer">
          <p className="text-muted">
            Total: {productos.length} productos
            {productos.filter((p) => p.isActive).length < productos.length && (
              <> • Activos: {productos.filter((p) => p.isActive).length}</>
            )}
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProducto ? "Editar Producto" : "Nuevo Producto"}</h3>
              <button onClick={handleCloseModal} className="btn-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name" className="form-label required">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label required">
                    Precio Unitario
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProducto ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
