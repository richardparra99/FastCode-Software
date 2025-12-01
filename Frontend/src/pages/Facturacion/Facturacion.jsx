import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
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
        ClienteService.obtenerTodos(),
        ProductoService.obtenerTodos({ isActive: true }),
      ]);

      if (facturasRes?.exito) setFacturas(facturasRes.datos || []);
      else setFacturas(facturasRes?.datos || facturasRes || []);

      if (clientesRes?.exito) setClientes(clientesRes.datos || []);
      else setClientes(clientesRes?.datos || clientesRes || []);

      if (productosRes?.exito) setProductos(productosRes.datos || []);
      else setProductos(productosRes?.datos || productosRes || []);

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
          if (campo === "productoId") {
            const producto = productos.find((p) => p.id === Number(valor));
            return {
              ...item,
              productoId: valor,
              precioUnitario: producto ? Number(producto.price ?? producto.precio ?? 0) : 0,
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
      const subtotal = Number(item.cantidad) * Number(item.precioUnitario);
      const descuento = (subtotal * Number(item.descuento || 0)) / 100;
      return total + (subtotal - descuento);
    }, 0);
  };

  const calcularIVA = () => calcularSubtotal() * 0.13;
  const calcularTotal = () => calcularSubtotal() + calcularIVA();

  const generarFacturaPDF = async (factura) => {
    try {
      // Fetch full invoice details with items
      const response = await FacturacionService.obtenerFacturaPorId(factura.id);
      const facturaCompleta = response.datos || response;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;

      // Encabezado
      doc.setFontSize(20);
      doc.text("PANADERÍA - FACTURA", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`N° Factura: ${facturaCompleta.numero_factura}`, 15, 35);
      doc.text(`Fecha: ${new Date(facturaCompleta.fecha_factura).toLocaleDateString()}`, pageWidth - 15, 35, { align: "right" });

      doc.text(`Cliente: ${facturaCompleta.cliente?.fullName || facturaCompleta.cliente_nombre || "Cliente Final"}`, 15, 45);
      doc.text(`NIT/CI: ${facturaCompleta.nit_cliente || "0"}`, 15, 52);

      // Detalles
      const detalles = facturaCompleta.detalles || [];

      const tableData = detalles.map(item => [
        item.producto?.name || item.producto_nombre || "Producto",
        item.cantidad,
        Number(item.precio_unitario).toFixed(2),
        Number(item.subtotal).toFixed(2)
      ]);

      if (tableData.length > 0) {
        doc.autoTable({
          startY: 60,
          head: [['Producto', 'Cant.', 'P. Unit.', 'Subtotal']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [41, 128, 185] },
          columnStyles: {
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
          }
        });
      } else {
        doc.text("(No hay detalles disponibles)", 15, 70);
      }

      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 80;

      // Totales
      doc.setFontSize(11);
      doc.text(`Subtotal: Bs. ${Number(facturaCompleta.subtotal).toFixed(2)}`, pageWidth - 15, finalY, { align: "right" });
      doc.text(`IVA (13%): Bs. ${Number(facturaCompleta.monto_impuesto).toFixed(2)}`, pageWidth - 15, finalY + 7, { align: "right" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Total: Bs. ${Number(facturaCompleta.monto_total).toFixed(2)}`, pageWidth - 15, finalY + 15, { align: "right" });

      // Pie de página
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Gracias por su preferencia", pageWidth / 2, doc.internal.pageSize.height - 10, { align: "center" });

      window.open(doc.output('bloburl'), '_blank');
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el PDF de la factura");
    }
  };

  const handleCrearFactura = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Debe agregar al menos un producto");
      return;
    }

    const itemsSinProducto = items.filter((item) => !item.productoId);
    if (itemsSinProducto.length > 0) {
      setError("Todos los items deben tener un producto seleccionado");
      return;
    }

    setLoading(true);
    try {
      const cliente = clienteSeleccionado
        ? clientes.find((c) => c.id === Number(clienteSeleccionado))
        : null;

      const datosFactura = {
        clienteId: clienteSeleccionado || null,
        razonSocial:
          cliente?.full_name ??
          cliente?.name ??
          cliente?.nombre ??
          "Cliente Final",
        metodoPago: "EFECTIVO",
        items: items.map((item) => ({
          productoId: Number(item.productoId),
          cantidad: Number(item.cantidad),
          precioUnitario: Number(item.precioUnitario),
          descuento: Number(item.descuento || 0),
        })),
      };

      const response = await FacturacionService.crearFactura(datosFactura);

      if (response?.exito) {
        setVistaActual("lista");
        setClienteSeleccionado("");
        setItems([]);
        setError("");
        await cargarDatos();
      } else {
        setError(response?.mensaje || "Error al crear factura");
      }
    } catch (err) {
      setError(err?.mensaje || "Error al crear factura");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderListaFacturas = () => (
    <div className="facturas-lista">
      <div className="page-header">
        <h2>Facturas</h2>
        <button className="btn btn-primary" onClick={() => setVistaActual("nueva")}>
          + Nueva Factura
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">Cargando facturas...</div>
      ) : facturas.length === 0 ? (
        <div className="empty-state">
          <p>No hay facturas registradas</p>
          <button className="btn btn-primary" onClick={() => setVistaActual("nueva")}>
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
                  <td><strong>#{factura.numero_factura}</strong></td>
                  <td>{new Date(factura.fecha_factura).toLocaleDateString()}</td>
                  <td>
                    {factura.cliente_nombre ||
                      "Cliente Final 3"}
                  </td>
                  <td>${Number(factura.subtotal || 0).toFixed(2)}</td>
                  <td>${Number(factura.monto_impuesto || 0).toFixed(2)}</td>
                  <td><strong>${Number(factura.monto_total || 0).toFixed(2)}</strong></td>
                  <td>
                    <span
                      className={`badge badge-${factura.estado === "PAGADA"
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
                    <button className="btn btn-sm btn-info" onClick={() => generarFacturaPDF(factura)}>Ver</button>
                    <button className="btn btn-sm btn-primary" onClick={() => generarFacturaPDF(factura)}>Imprimir PDF</button>
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
        <button className="btn btn-secondary" onClick={() => setVistaActual("lista")}>
          ← Volver
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleCrearFactura} className="factura-form">
        <div className="form-section">
          <h3>Información del Cliente</h3>
          <div className="form-group">
            <label>Cliente</label>
            <select
              className="form-control"
              value={clienteSeleccionado}
              onChange={(e) => setClienteSeleccionado(e.target.value)}
            >
              <option value="">Cliente Final (sin registrar)</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.fullName ?? cliente.name ?? cliente.nombre}
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
                    const subtotal = Number(item.cantidad) * Number(item.precioUnitario);
                    const descuento = (subtotal * Number(item.descuento || 0)) / 100;
                    const total = subtotal - descuento;

                    return (
                      <tr key={item.id}>
                        <td>
                          <select
                            className="form-control"
                            value={item.productoId}
                            onChange={(e) =>
                              actualizarItem(item.id, "productoId", e.target.value)
                            }
                            required
                          >
                            <option value="">Seleccione producto</option>
                            {productos.map((producto) => (
                              <option key={producto.id} value={producto.id}>
                                {producto.name ?? producto.nombre}
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
                              actualizarItem(item.id, "cantidad", Number(e.target.value))
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
                              actualizarItem(item.id, "precioUnitario", Number(e.target.value))
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
                              actualizarItem(item.id, "descuento", Number(e.target.value))
                            }
                          />
                        </td>

                        <td><strong>${total.toFixed(2)}</strong></td>

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
