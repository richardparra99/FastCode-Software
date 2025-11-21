import { useState, useEffect } from "react";
import ContabilidadService from "../../services/ContabilidadService";
import "./Contabilidad.css";

const Contabilidad = () => {
  const [vistaActual, setVistaActual] = useState("plan-cuentas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planCuentas, setPlanCuentas] = useState([]);
  const [libroDiario, setLibroDiario] = useState([]);
  const [balanceGeneral, setBalanceGeneral] = useState(null);
  const [estadoResultados, setEstadoResultados] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    // Establecer fecha por defecto (mes actual)
    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    setFechaInicio(primerDia.toISOString().split("T")[0]);
    setFechaFin(hoy.toISOString().split("T")[0]);

    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vistaActual]);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      if (vistaActual === "plan-cuentas") {
        const response = await ContabilidadService.obtenerPlanCuentas();
        if (response.exito) {
          setPlanCuentas(response.datos);
        }
      } else if (vistaActual === "libro-diario") {
        if (fechaInicio && fechaFin) {
          const response = await ContabilidadService.obtenerLibroDiario(
            fechaInicio,
            fechaFin
          );
          if (response.exito) {
            setLibroDiario(response.datos?.asientos || []);
          }
        }
      } else if (vistaActual === "balance-general") {
        const response = await ContabilidadService.obtenerBalanceGeneral(
          fechaFin || new Date().toISOString().split("T")[0]
        );
        if (response.exito) {
          setBalanceGeneral(response.datos);
        }
      } else if (vistaActual === "estado-resultados") {
        if (fechaInicio && fechaFin) {
          const response = await ContabilidadService.obtenerEstadoResultados(
            fechaInicio,
            fechaFin
          );
          if (response.exito) {
            setEstadoResultados(response.datos);
          }
        }
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar la información contable");
    } finally {
      setLoading(false);
    }
  };

  const handleConsultar = () => {
    cargarDatos();
  };

  const renderPlanCuentas = () => {
    const cuentasPorNivel = {};

    planCuentas.forEach((cuenta) => {
      const nivel = cuenta.codigo.split(".").length;
      if (!cuentasPorNivel[nivel]) {
        cuentasPorNivel[nivel] = [];
      }
      cuentasPorNivel[nivel].push(cuenta);
    });

    return (
      <div className="plan-cuentas">
        <h3>Plan de Cuentas</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Nivel</th>
              </tr>
            </thead>
            <tbody>
              {planCuentas.map((cuenta) => {
                const nivel = cuenta.codigo.split(".").length;
                return (
                  <tr
                    key={cuenta.id}
                    className={`nivel-${nivel}`}
                    style={{ paddingLeft: `${nivel * 1}rem` }}
                  >
                    <td>
                      <strong>{cuenta.codigo}</strong>
                    </td>
                    <td style={{ paddingLeft: `${(nivel - 1) * 1.5}rem` }}>
                      {cuenta.nombre}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${getTipoBadge(cuenta.tipo)}`}
                      >
                        {cuenta.tipo}
                      </span>
                    </td>
                    <td>{nivel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLibroDiario = () => (
    <div className="libro-diario">
      <h3>Libro Diario</h3>
      <div className="filtros-fecha">
        <div className="form-group">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Fecha Fin:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button onClick={handleConsultar} className="btn btn-primary">
          Consultar
        </button>
      </div>

      {libroDiario.length === 0 ? (
        <p className="text-muted text-center">
          No hay movimientos en el período seleccionado
        </p>
      ) : (
        <div className="asientos-list">
          {libroDiario.map((asiento) => (
            <div
              key={asiento.id || asiento.idAsientoContable}
              className="asiento-card"
            >
              <div className="asiento-header">
                <div>
                  <strong>Asiento #{asiento.numeroAsiento}</strong>
                  <span className="asiento-fecha">
                    {new Date(asiento.fecha).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className={`badge badge-${getEstadoBadge(asiento.estado)}`}
                >
                  {asiento.estado}
                </span>
              </div>
              <p className="asiento-descripcion">{asiento.descripcion}</p>
              <div className="detalles-table">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Cuenta</th>
                      <th className="text-right">Debe</th>
                      <th className="text-right">Haber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asiento.detalles?.map((detalle, idx) => (
                      <tr key={idx}>
                        <td>{detalle.cuenta?.nombre}</td>
                        <td className="text-right">
                          {detalle.debe > 0
                            ? `$${detalle.debe.toFixed(2)}`
                            : "-"}
                        </td>
                        <td className="text-right">
                          {detalle.haber > 0
                            ? `$${detalle.haber.toFixed(2)}`
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBalanceGeneral = () => (
    <div className="balance-general">
      <h3>Balance General</h3>
      <div className="filtros-fecha">
        <div className="form-group">
          <label>Fecha de Corte:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button onClick={handleConsultar} className="btn btn-primary">
          Consultar
        </button>
      </div>

      {balanceGeneral && (
        <div className="balance-content">
          <div className="balance-section">
            <h4>Activos</h4>
            <div className="cuentas-list">
              {balanceGeneral.ACTIVO &&
                Array.isArray(balanceGeneral.ACTIVO) &&
                balanceGeneral.ACTIVO.map((cuenta) => (
                  <div key={cuenta.id || cuenta.codigo} className="cuenta-item">
                    <span>{cuenta.nombre}</span>
                    <span className="monto">
                      ${cuenta.saldo?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
            </div>
            <div className="total-section">
              <strong>Total Activos:</strong>
              <strong className="monto">
                ${balanceGeneral.totalActivos?.toFixed(2) || "0.00"}
              </strong>
            </div>
          </div>

          <div className="balance-section">
            <h4>Pasivos</h4>
            <div className="cuentas-list">
              {balanceGeneral.PASIVO &&
                Array.isArray(balanceGeneral.PASIVO) &&
                balanceGeneral.PASIVO.map((cuenta) => (
                  <div key={cuenta.id || cuenta.codigo} className="cuenta-item">
                    <span>{cuenta.nombre}</span>
                    <span className="monto">
                      ${cuenta.saldo?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
            </div>
            <div className="total-section">
              <strong>Total Pasivos:</strong>
              <strong className="monto">
                ${balanceGeneral.totalPasivos?.toFixed(2) || "0.00"}
              </strong>
            </div>
          </div>

          <div className="balance-section">
            <h4>Patrimonio</h4>
            <div className="cuentas-list">
              {balanceGeneral.PATRIMONIO &&
                Array.isArray(balanceGeneral.PATRIMONIO) &&
                balanceGeneral.PATRIMONIO.map((cuenta) => (
                  <div key={cuenta.id || cuenta.codigo} className="cuenta-item">
                    <span>{cuenta.nombre}</span>
                    <span className="monto">
                      ${cuenta.saldo?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
            </div>
            <div className="total-section">
              <strong>Total Patrimonio:</strong>
              <strong className="monto">
                ${balanceGeneral.totalPatrimonio?.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEstadoResultados = () => (
    <div className="estado-resultados">
      <h3>Estado de Resultados</h3>
      <div className="filtros-fecha">
        <div className="form-group">
          <label>Fecha Inicio:</label>
          <input
            type="date"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Fecha Fin:</label>
          <input
            type="date"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button onClick={handleConsultar} className="btn btn-primary">
          Consultar
        </button>
      </div>

      {estadoResultados && (
        <div className="estado-content">
          <div className="estado-section">
            <h4>Ingresos</h4>
            <div className="cuentas-list">
              {estadoResultados.INGRESO &&
                Array.isArray(estadoResultados.INGRESO) &&
                estadoResultados.INGRESO.map((cuenta) => (
                  <div key={cuenta.id || cuenta.codigo} className="cuenta-item">
                    <span>{cuenta.nombre}</span>
                    <span className="monto positivo">
                      ${cuenta.saldo?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
            </div>
            <div className="subtotal-section">
              <strong>Total Ingresos:</strong>
              <strong className="monto positivo">
                ${estadoResultados.totalIngresos?.toFixed(2) || "0.00"}
              </strong>
            </div>
          </div>

          <div className="estado-section">
            <h4>Gastos</h4>
            <div className="cuentas-list">
              {estadoResultados.GASTO &&
                Array.isArray(estadoResultados.GASTO) &&
                estadoResultados.GASTO.map((cuenta) => (
                  <div key={cuenta.id || cuenta.codigo} className="cuenta-item">
                    <span>{cuenta.nombre}</span>
                    <span className="monto negativo">
                      ${cuenta.saldo?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))}
            </div>
            <div className="subtotal-section">
              <strong>Total Gastos:</strong>
              <strong className="monto negativo">
                ${estadoResultados.totalGastos?.toFixed(2) || "0.00"}
              </strong>
            </div>
          </div>

          <div className="resultado-final">
            <h4>
              {estadoResultados.utilidad >= 0
                ? "Utilidad del Período"
                : "Pérdida del Período"}
            </h4>
            <h2
              className={`monto ${estadoResultados.utilidad >= 0 ? "positivo" : "negativo"
                }`}
            >
              ${Math.abs(estadoResultados.utilidad).toFixed(2)}
            </h2>
          </div>
        </div>
      )}
    </div>
  );

  const getTipoBadge = (tipo) => {
    const badges = {
      ACTIVO: "info",
      PASIVO: "warning",
      PATRIMONIO: "success",
      INGRESO: "success",
      GASTO: "danger",
    };
    return badges[tipo] || "secondary";
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      BORRADOR: "warning",
      APROBADO: "success",
      ANULADO: "danger",
    };
    return badges[estado] || "secondary";
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="contabilidad-page">
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError("")} className="alert-close">
            ×
          </button>
        </div>
      )}

      <div className="page-header">
        <h2>Módulo de Contabilidad</h2>
      </div>

      <div className="contabilidad-tabs">
        <button
          className={`tab-btn ${vistaActual === "plan-cuentas" ? "active" : ""
            }`}
          onClick={() => setVistaActual("plan-cuentas")}
        >
          📋 Plan de Cuentas
        </button>
        <button
          className={`tab-btn ${vistaActual === "libro-diario" ? "active" : ""
            }`}
          onClick={() => setVistaActual("libro-diario")}
        >
          📖 Libro Diario
        </button>
        <button
          className={`tab-btn ${vistaActual === "balance-general" ? "active" : ""
            }`}
          onClick={() => setVistaActual("balance-general")}
        >
          ⚖️ Balance General
        </button>
        <button
          className={`tab-btn ${vistaActual === "estado-resultados" ? "active" : ""
            }`}
          onClick={() => setVistaActual("estado-resultados")}
        >
          📊 Estado de Resultados
        </button>
      </div>

      <div className="card">
        {vistaActual === "plan-cuentas" && renderPlanCuentas()}
        {vistaActual === "libro-diario" && renderLibroDiario()}
        {vistaActual === "balance-general" && renderBalanceGeneral()}
        {vistaActual === "estado-resultados" && renderEstadoResultados()}
      </div>
    </div>
  );
};

export default Contabilidad;
