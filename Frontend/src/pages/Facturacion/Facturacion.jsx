import { useState, useEffect } from "react";
import FacturacionService from "../../services/FacturacionService";
import ClienteService from "../../services/ClienteService";
import ProductoService from "../../services/ProductoService";
import "./Facturacion.css";

const Facturacion = () => {
  const [vistaActual, setVistaActual] = useState("lista");
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para nueva factura
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [items, setItems] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar facturas, clientes y productos
      const [facturasRes, clientesRes, productosRes] = await Promise.all([
        FacturacionService.obtenerFacturas(),
        ClienteService.obtenerClientes(),
        ProductoService.obtenerProductos(),
      ]);

      if (facturasRes.exito) {
        setFacturas(facturasRes.datos || []);
      }
      if (clientesRes.exito) {
        setClientes(clientesRes.datos || []);
      }
      if (productosRes.exito) {
        setProductos(productosRes.datos || []);
      }

      setError("");
    } catch (err) {
      setError("Error al cargar datos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const agregarItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        productoId: "",
        cantidad: 1,
        precioUnitario: 0,
        descuento: 0,
      },
    ]);
  };

  const eliminarItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const actualizarItem = (id, campo, valor) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          // Si se actualiza el productoId, también actualizar el precio
          if (campo === "productoId") {
            const producto = productos.find((p) => p.id === parseInt(valor));
            return {
              ...item,
              productoId: valor,
              precioUnitario: producto ? parseFloat(producto.price) : 0,
            };
          }
          return { ...item, [campo]: valor };
        }
        return item;
      })
    );
  };

  const calcularSubtotal = () => {
    return items.reduce((total, item) => {
      const subtotal = item.cantidad * item.precioUnitario;
      const descuento = (subtotal * item.descuento) / 100;
      return total + (subtotal - descuento);
    }, 0);
  };

  const calcularIVA = () => {
    return calcularSubtotal() * 0.13;
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const handleCrearFactura = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Debe agregar al menos un producto");
      return;
    }

    // Validar que todos los items tengan producto seleccionado
    const itemsSinProducto = items.filter((item) => !item.productoId);
    if (itemsSinProducto.length > 0) {
      setError("Todos los items deben tener un producto seleccionado");
      return;
    }

    setLoading(true);
    try {
      const cliente = clienteSeleccionado
        ? clientes.find((c) => c.id === parseInt(clienteSeleccionado))
        : null;

      const datosFactura = {
        clienteId: clienteSeleccionado || null,
        razonSocial: cliente?.name || "Cliente Final",
        nit: cliente?.nit || "0",
        metodoPago: "EFECTIVO",
        items: items.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          descuento: item.descuento,
        })),
      };

      const response = await FacturacionService.crearFactura(datosFactura);

      if (response.exito) {
        setVistaActual("lista");
        setClienteSeleccionado("");
        setItems([]);
        setError("");
        await cargarDatos();
      } else {
        setError(response.mensaje || "Error al crear factura");
      }
    } catch (err) {
      setError(err.mensaje || "Error al crear factura");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderListaFacturas = () => (
    <div className="facturas-lista">
      <div className="page-header">
        <h2>Facturas</h2>
        <button
          className="btn btn-primary"
          onClick={() => setVistaActual("nueva")}
        >
          + Nueva Factura
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">Cargando facturas...</div>
      ) : facturas.length === 0 ? (
        <div className="empty-state">
          <p>No hay facturas registradas</p>
          <button
            className="btn btn-primary"
            onClick={() => setVistaActual("nueva")}
          >
            Crear primera factura
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Subtotal</th>
                <th>IVA</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {facturas.map((factura) => (
                <tr key={factura.id}>
                  <td>
                    <strong>#{factura.numero_factura}</strong>
                  </td>
                  <td>
                    {new Date(factura.fecha_factura).toLocaleDateString()}
                  </td>
                  <td>{factura.cliente?.name || factura.razon_social}</td>
                  <td>${parseFloat(factura.subtotal || 0).toFixed(2)}</td>
                  <td>${parseFloat(factura.monto_impuesto || 0).toFixed(2)}</td>
                  <td>
                    <strong>
                      ${parseFloat(factura.monto_total || 0).toFixed(2)}
                    </strong>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${
                        factura.estado === "PAGADA"
                          ? "success"
                          : factura.estado === "EMITIDA"
                          ? "warning"
                          : "danger"
                      }`}
                    >
                      {factura.estado}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-info">Ver</button>
                    <button className="btn btn-sm btn-primary">Imprimir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderNuevaFactura = () => (
    <div className="nueva-factura">
      <div className="page-header">
        <h2>Nueva Factura</h2>
        <button
          className="btn btn-secondary"
          onClick={() => setVistaActual("lista")}
        >
          ← Volver
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleCrearFactura} className="factura-form">
        <div className="form-section">
          <h3>Información del Cliente</h3>
          <div className="form-group">
            <label>Cliente *</label>
            <select
              className="form-control"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
              required
            >
              <option value="">Seleccione un cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Productos</h3>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={agregarItem}
            >
              + Agregar Producto
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-muted">
              No hay productos agregados. Haga clic en "Agregar Producto".
            </p>
          ) : (
            <div className="items-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Descuento %</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const subtotal = item.cantidad * item.precioUnitario;
                    const descuento = (subtotal * item.descuento) / 100;
                    const total = subtotal - descuento;

                    return (
                      <tr key={item.id}>
                        <td>
                          <select
                            className="form-control"
                            value={item.productoId}
                            onChange={(e) =>
                              actualizarItem(
                                item.id,
                                "productoId",
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Seleccione producto</option>
                            {productos.map((producto) => (
                              <option key={producto.id} value={producto.id}>
                                {producto.nombre}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) =>
                              actualizarItem(
                                item.id,
                                "cantidad",
                                parseFloat(e.target.value)
                              )
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            step="0.01"
                            value={item.precioUnitario}
                            onChange={(e) =>
                              actualizarItem(
                                item.id,
                                "precioUnitario",
                                parseFloat(e.target.value)
                              )
                            }
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            max="100"
                            value={item.descuento}
                            onChange={(e) =>
                              actualizarItem(
                                item.id,
                                "descuento",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </td>
                        <td>
                          <strong>${total.toFixed(2)}</strong>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => eliminarItem(item.id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="form-section totales">
          <div className="totales-grid">
            <div className="total-item">
              <span>Subtotal:</span>
              <strong>${calcularSubtotal().toFixed(2)}</strong>
            </div>
            <div className="total-item">
              <span>IVA (13%):</span>
              <strong>${calcularIVA().toFixed(2)}</strong>
            </div>
            <div className="total-item total-final">
              <span>Total:</span>
              <strong>${calcularTotal().toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setVistaActual("lista")}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            Crear Factura
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="facturacion-container">
      {vistaActual === "lista" ? renderListaFacturas() : renderNuevaFactura()}
    </div>
  );
};

export default Facturacion;
