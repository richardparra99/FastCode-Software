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
                    {asiento.detalles?.map((detalle, idx) => {
                      const debeNum = Number(detalle.debe || 0);
                      const haberNum = Number(detalle.haber || 0);

                      return (
                        <tr key={idx}>
                          <td>{detalle.cuenta?.nombre}</td>
                          <td className="text-right">
                            {debeNum > 0 ? `$${debeNum.toFixed(2)}` : "-"}
                          </td>
                          <td className="text-right">
                            {haberNum > 0 ? `$${haberNum.toFixed(2)}` : "-"}
                          </td>
                        </tr>
                      );
                    })}
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

      {balanceGeneral ? (
        <div className="balance-content">
          <div className="balance-row">
            {/* ACTIVOS */}
            <div className="balance-section">
              <h4>ACTIVOS</h4>
              <div className="cuentas-list">
                {balanceGeneral.activos?.cuentas?.length > 0 ? (
                  balanceGeneral.activos.cuentas.map((cuenta) => (
                    <div key={cuenta.codigo} className="cuenta-item">
                      <span className="cuenta-codigo">{cuenta.codigo}</span>
                      <span className="cuenta-nombre">{cuenta.nombre}</span>
                      <span className="monto">
                        Bs. {cuenta.saldo?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No hay activos registrados</p>
                )}
              </div>
              <div className="total-section">
                <strong>Total Activos:</strong>
                <strong className="monto">
                  Bs. {balanceGeneral.activos?.total?.toFixed(2) || "0.00"}
                </strong>
              </div>
            </div>

            {/* PASIVOS Y PATRIMONIO */}
            <div className="balance-section">
              <h4>PASIVOS</h4>
              <div className="cuentas-list">
                {balanceGeneral.pasivos?.cuentas?.length > 0 ? (
                  balanceGeneral.pasivos.cuentas.map((cuenta) => (
                    <div key={cuenta.codigo} className="cuenta-item">
                      <span className="cuenta-codigo">{cuenta.codigo}</span>
                      <span className="cuenta-nombre">{cuenta.nombre}</span>
                      <span className="monto">
                        Bs. {cuenta.saldo?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No hay pasivos registrados</p>
                )}
              </div>
              <div className="subtotal-section">
                <strong>Total Pasivos:</strong>
                <strong className="monto">
                  Bs. {balanceGeneral.pasivos?.total?.toFixed(2) || "0.00"}
                </strong>
              </div>

              <h4 className="mt-3">PATRIMONIO</h4>
              <div className="cuentas-list">
                {balanceGeneral.patrimonio?.cuentas?.length > 0 ? (
                  balanceGeneral.patrimonio.cuentas.map((cuenta) => (
                    <div key={cuenta.codigo} className="cuenta-item">
                      <span className="cuenta-codigo">{cuenta.codigo}</span>
                      <span className="cuenta-nombre">{cuenta.nombre}</span>
                      <span className="monto">
                        Bs. {cuenta.saldo?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No hay patrimonio registrado</p>
                )}
              </div>
              <div className="subtotal-section">
                <strong>Total Patrimonio:</strong>
                <strong className="monto">
                  Bs. {balanceGeneral.patrimonio?.total?.toFixed(2) || "0.00"}
                </strong>
              </div>

              <div className="total-section mt-3">
                <strong>Total Pasivo + Patrimonio:</strong>
                <strong className="monto">
                  Bs. {balanceGeneral.totalPasivoPatrimonio?.toFixed(2) || "0.00"}
                </strong>
              </div>
            </div>
          </div>

          {/* Verificación de balance */}
          <div className={`balance-verificacion ${balanceGeneral.estaBalanceado ? 'balanceado' : 'desbalanceado'}`}>
            {balanceGeneral.estaBalanceado ? (
              <div className="alert alert-success">
                ✅ Balance correcto: Activos = Pasivos + Patrimonio
              </div>
            ) : (
              <div className="alert alert-warning">
                ⚠️ Balance desbalanceado - Verificar registros contables
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-muted text-center">
          Selecciona una fecha y presiona Consultar
        </p>
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

      {estadoResultados ? (
        <div className="estado-content">
          {/* INGRESOS */}
          <div className="estado-section">
            <h4>INGRESOS</h4>
            <div className="cuentas-list">
              {estadoResultados.ingresos?.cuentas?.length > 0 ? (
                estadoResultados.ingresos.cuentas.map((cuenta) => (
                  <div key={cuenta.codigo} className="cuenta-item">
                    <span className="cuenta-codigo">{cuenta.codigo}</span>
                    <span className="cuenta-nombre">{cuenta.nombre}</span>
                    <span className="monto positivo">
                      Bs. {cuenta.monto?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted">No hay ingresos registrados</p>
              )}
            </div>
            <div className="subtotal-section">
              <strong>Total Ingresos:</strong>
              <strong className="monto positivo">
                Bs. {estadoResultados.ingresos?.total?.toFixed(2) || "0.00"}
              </strong>
            </div>
          </div>

          {/* GASTOS */}
          <div className="estado-section">
            <h4>GASTOS</h4>
            <div className="cuentas-list">
              {estadoResultados.gastos?.cuentas?.length > 0 ? (
                estadoResultados.gastos.cuentas.map((cuenta) => (
                  <div key={cuenta.codigo} className="cuenta-item">
                    <span className="cuenta-codigo">{cuenta.codigo}</span>
                    <span className="cuenta-nombre">{cuenta.nombre}</span>
                    <span className="monto negativo">
                      Bs. {cuenta.monto?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted">No hay gastos registrados</p>
              )}
            </div>
            <div className="subtotal-section">
              <strong>Total Gastos:</strong>
              <strong className="monto negativo">
                Bs. {estadoResultados.gastos?.total?.toFixed(2) || "0.00"}
              </strong>
            </div>
          </div>

          {/* RESULTADO FINAL */}
          <div className="resultado-final">
            <h4>
              {estadoResultados.utilidadNeta >= 0
                ? "🎉 Utilidad del Período"
                : "⚠️ Pérdida del Período"}
            </h4>
            <h2
              className={`monto ${estadoResultados.utilidadNeta >= 0 ? "positivo" : "negativo"
                }`}
            >
              Bs. {estadoResultados.utilidadNeta?.toFixed(2) || "0.00"}
            </h2>
          </div>

          {/* Período */}
          <div className="periodo-info">
            <p className="text-muted">
              Período: {new Date(estadoResultados.periodo?.fechaInicio).toLocaleDateString()} - {new Date(estadoResultados.periodo?.fechaFin).toLocaleDateString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-muted text-center">
          Selecciona un rango de fechas y presiona Consultar
        </p>
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
