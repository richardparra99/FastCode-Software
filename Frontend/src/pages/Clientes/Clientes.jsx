import { useState, useEffect } from "react";
import ClienteService from "../../services/ClienteService";
import "./Clientes.css";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    isWhatsapp: false,
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await ClienteService.obtenerTodos();
      if (response.exito) {
        setClientes(response.datos);
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError("Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      cargarClientes();
    } else {
      try {
        const response = await ClienteService.obtenerTodos({ buscar: term });
        if (response.exito) {
          setClientes(response.datos);
        }
      } catch (err) {
        console.error("Error en búsqueda:", err);
      }
    }
  };

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setEditingCliente(cliente);
      setFormData({
        fullName: cliente.fullName,
        phone: cliente.phone || "",
        address: cliente.address || "",
        isWhatsapp: cliente.isWhatsapp || false,
      });
    } else {
      setEditingCliente(null);
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        isWhatsapp: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setFormData({
      fullName: "",
      phone: "",
      address: "",
      isWhatsapp: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let response;
      if (editingCliente) {
        response = await ClienteService.actualizar(editingCliente.id, formData);
      } else {
        response = await ClienteService.crear(formData);
      }

      if (response.exito) {
        cargarClientes();
        handleCloseModal();
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError(err.response?.data?.mensaje || "Error al guardar cliente");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este cliente?")) {
      return;
    }

    try {
      const response = await ClienteService.eliminar(id);
      if (response.exito) {
        cargarClientes();
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError("Error al eliminar cliente");
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
    <div className="clientes-page">
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError("")} className="alert-close">
            ×
          </button>
        </div>
      )}

      <div className="page-header">
        <h2>Gestión de Clientes</h2>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          + Nuevo Cliente
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>WhatsApp</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td>{cliente.id}</td>
                    <td>{cliente.fullName}</td>
                    <td>{cliente.phone || "-"}</td>
                    <td>
                      {cliente.isWhatsapp ? (
                        <span className="badge badge-success">Sí</span>
                      ) : (
                        <span className="badge badge-secondary">No</span>
                      )}
                    </td>
                    <td>{cliente.address || "-"}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleOpenModal(cliente)}
                          className="btn btn-sm btn-outline"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="btn btn-sm btn-danger"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p className="text-muted">Total: {clientes.length} clientes</p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>
              <button onClick={handleCloseModal} className="btn-close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label required">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address" className="form-label">
                    Dirección
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className="form-control"
                    rows="3"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isWhatsapp"
                      checked={formData.isWhatsapp}
                      onChange={handleChange}
                    />
                    <span>Tiene WhatsApp</span>
                  </label>
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
                  {editingCliente ? "Guardar Cambios" : "Crear Cliente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;
