import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ContabilidadService from "../../services/ContabilidadService";
import "./Contabilidad.css";

const Contabilidad = () => {
  const [vistaActual, setVistaActual] = useState("plan-cuentas");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planCuentas, setPlanCuentas] = useState([]);
  const [libroDiario, setLibroDiario] = useState([]);
  const [libroMayor, setLibroMayor] = useState(null);
  const [balanceGeneral, setBalanceGeneral] = useState(null);
  const [estadoResultados, setEstadoResultados] = useState(null);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState("");

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
      } else if (vistaActual === "libro-mayor") {
        if (fechaInicio && fechaFin) {
          if (cuentaSeleccionada) {
            const response = await ContabilidadService.obtenerLibroMayor(
              cuentaSeleccionada,
              fechaInicio,
              fechaFin
            );
            if (response.exito) {
              setLibroMayor(response.datos);
            }
          } else {
            // Cargar libro mayor general (todas las cuentas)
            const response = await ContabilidadService.obtenerLibroMayorGeneral(
              fechaInicio,
              fechaFin
            );
            if (response.exito) {
              setLibroMayor(response.datos);
            }
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

  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Configuración general
    doc.setFontSize(18);
    doc.text("PANADERÍA - SISTEMA CONTABLE", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, pageWidth - 15, 15, { align: "right" });

    if (vistaActual === "plan-cuentas") {
      doc.setFontSize(14);
      doc.text("PLAN DE CUENTAS", pageWidth / 2, 25, { align: "center" });

      const tableData = planCuentas.map(c => [
        c.codigo,
        { content: c.nombre, styles: { cellPadding: { left: (c.codigo.split('.').length - 1) * 2 } } },
        c.tipo,
        c.nivel
      ]);

      doc.autoTable({
        startY: 30,
        head: [['Código', 'Nombre', 'Tipo', 'Nivel']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

    } else if (vistaActual === "libro-diario") {
      doc.setFontSize(14);
      doc.text("LIBRO DIARIO", pageWidth / 2, 25, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Del: ${fechaInicio} Al: ${fechaFin}`, pageWidth / 2, 32, { align: "center" });

      let yPos = 40;

      libroDiario.forEach((asiento) => {
        // Cabecera del asiento
        doc.setFillColor(240, 240, 240);
        doc.rect(14, yPos, pageWidth - 28, 8, 'F');
        doc.setFont("helvetica", "bold");
        doc.text(`Asiento #${asiento.numeroAsiento} - ${new Date(asiento.fecha).toLocaleDateString()}`, 16, yPos + 5);
        yPos += 10;

        // Descripción
        doc.setFont("helvetica", "italic");
        doc.text(asiento.descripcion, 16, yPos);
        yPos += 5;

        // Tabla de detalles
        const detallesData = asiento.detalles.map(d => [
          d.cuenta.codigo,
          d.cuenta.nombre,
          d.debe > 0 ? Number(d.debe).toFixed(2) : "",
          d.haber > 0 ? Number(d.haber).toFixed(2) : ""
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Código', 'Cuenta', 'Debe', 'Haber']],
          body: detallesData,
          theme: 'plain',
          styles: { fontSize: 9 },
          columnStyles: {
            2: { halign: 'right' },
            3: { halign: 'right' }
          },
          margin: { left: 20 }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Nueva página si es necesario
        if (yPos > doc.internal.pageSize.height - 20) {
          doc.addPage();
          yPos = 20;
        }
      });

    } else if (vistaActual === "libro-mayor" && libroMayor) {
      doc.setFontSize(14);
      doc.text("LIBRO MAYOR", pageWidth / 2, 25, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Del: ${fechaInicio} Al: ${fechaFin}`, pageWidth / 2, 32, { align: "center" });

      // Si es array, es el general
      const cuentasMayor = Array.isArray(libroMayor) ? libroMayor : [libroMayor];

      let yPos = 40;

      cuentasMayor.forEach(mayor => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`Cuenta: ${mayor.cuenta.codigo} - ${mayor.cuenta.nombre}`, 14, yPos);
        yPos += 5;

        const tableData = mayor.movimientos.map(m => [
          new Date(m.fecha).toLocaleDateString(),
          m.numeroAsiento,
          m.descripcion,
          m.debe > 0 ? Number(m.debe).toFixed(2) : "",
          m.haber > 0 ? Number(m.haber).toFixed(2) : "",
          Number(m.saldo).toFixed(2)
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Fecha', 'Asiento', 'Descripción', 'Debe', 'Haber', 'Saldo']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8 },
          columnStyles: {
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right', fontStyle: 'bold' }
          },
          headStyles: { fillColor: [41, 128, 185] },
          margin: { left: 14, right: 14 }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Nueva página si es necesario
        if (yPos > doc.internal.pageSize.height - 30) {
          doc.addPage();
          yPos = 20;
        }
      });

    } else if (vistaActual === "balance-general" && balanceGeneral) {
      doc.setFontSize(14);
      doc.text("BALANCE GENERAL", pageWidth / 2, 25, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Al: ${fechaFin}`, pageWidth / 2, 32, { align: "center" });

      const bodyData = [];

      // Activos
      bodyData.push([{ content: "ACTIVOS", colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }]);
      balanceGeneral.activos.cuentas.forEach(c => {
        bodyData.push([c.codigo, c.nombre, { content: Number(c.saldo).toFixed(2), styles: { halign: 'right' } }]);
      });
      bodyData.push([{ content: "Total Activos", colSpan: 2, styles: { fontStyle: 'bold' } }, { content: Number(balanceGeneral.activos.total).toFixed(2), styles: { fontStyle: 'bold', halign: 'right' } }]);

      // Pasivos
      bodyData.push([{ content: "PASIVOS", colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }]);
      balanceGeneral.pasivos.cuentas.forEach(c => {
        bodyData.push([c.codigo, c.nombre, { content: Number(c.saldo).toFixed(2), styles: { halign: 'right' } }]);
      });
      bodyData.push([{ content: "Total Pasivos", colSpan: 2, styles: { fontStyle: 'bold' } }, { content: Number(balanceGeneral.pasivos.total).toFixed(2), styles: { fontStyle: 'bold', halign: 'right' } }]);

      // Patrimonio
      bodyData.push([{ content: "PATRIMONIO", colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }]);
      balanceGeneral.patrimonio.cuentas.forEach(c => {
        bodyData.push([c.codigo, c.nombre, { content: Number(c.saldo).toFixed(2), styles: { halign: 'right' } }]);
      });
      bodyData.push([{ content: "Total Patrimonio", colSpan: 2, styles: { fontStyle: 'bold' } }, { content: Number(balanceGeneral.patrimonio.total).toFixed(2), styles: { fontStyle: 'bold', halign: 'right' } }]);

      // Total Pasivo + Patrimonio
      bodyData.push([{ content: "Total Pasivo + Patrimonio", colSpan: 2, styles: { fontStyle: 'bold', fillColor: [200, 200, 200] } }, { content: Number(balanceGeneral.totalPasivoPatrimonio).toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: [200, 200, 200] } }]);

      doc.autoTable({
        startY: 40,
        head: [['Código', 'Cuenta', 'Saldo']],
        body: bodyData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

    } else if (vistaActual === "estado-resultados" && estadoResultados) {
      doc.setFontSize(14);
      doc.text("ESTADO DE RESULTADOS", pageWidth / 2, 25, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Del: ${fechaInicio} Al: ${fechaFin}`, pageWidth / 2, 32, { align: "center" });

      const bodyData = [];

      // Ingresos
      bodyData.push([{ content: "INGRESOS", colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }]);
      estadoResultados.ingresos.cuentas.forEach(c => {
        bodyData.push([c.codigo, c.nombre, { content: Number(c.monto).toFixed(2), styles: { halign: 'right' } }]);
      });
      bodyData.push([{ content: "Total Ingresos", colSpan: 2, styles: { fontStyle: 'bold' } }, { content: Number(estadoResultados.ingresos.total).toFixed(2), styles: { fontStyle: 'bold', halign: 'right' } }]);

      // Gastos
      bodyData.push([{ content: "GASTOS", colSpan: 3, styles: { fontStyle: 'bold', fillColor: [220, 220, 220] } }]);
      estadoResultados.gastos.cuentas.forEach(c => {
        bodyData.push([c.codigo, c.nombre, { content: Number(c.monto).toFixed(2), styles: { halign: 'right' } }]);
      });
      bodyData.push([{ content: "Total Gastos", colSpan: 2, styles: { fontStyle: 'bold' } }, { content: Number(estadoResultados.gastos.total).toFixed(2), styles: { fontStyle: 'bold', halign: 'right' } }]);

      // Resultado
      const utilidad = estadoResultados.utilidadNeta;
      const label = utilidad >= 0 ? "UTILIDAD DEL PERÍODO" : "PÉRDIDA DEL PERÍODO";
      const color = utilidad >= 0 ? [200, 255, 200] : [255, 200, 200];

      bodyData.push([{ content: label, colSpan: 2, styles: { fontStyle: 'bold', fillColor: color } }, { content: Number(utilidad).toFixed(2), styles: { fontStyle: 'bold', halign: 'right', fillColor: color } }]);

      doc.autoTable({
        startY: 40,
        head: [['Código', 'Cuenta', 'Monto']],
        body: bodyData,
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });
    }

    // Abrir PDF en nueva pestaña
    window.open(doc.output('bloburl'), '_blank');
  };

  const renderLibroMayor = () => {
    // Determinar si mostramos una cuenta o todas
    const cuentasAVisualizar = Array.isArray(libroMayor)
      ? libroMayor
      : libroMayor ? [libroMayor] : [];

    return (
      <div className="libro-mayor">
        <h3>Libro Mayor</h3>
        <div className="filtros-fecha">
          <div className="form-group">
            <label>Cuenta (Opcional):</label>
            <select
              className="form-control"
              value={cuentaSeleccionada}
              onChange={(e) => setCuentaSeleccionada(e.target.value)}
            >
              <option value="">Todas las cuentas</option>
              {planCuentas
                .filter(c => c.nivel > 1)
                .map(cuenta => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.codigo} - {cuenta.nombre}
                  </option>
                ))}
            </select>
          </div>
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
          <button onClick={generarPDF} className="btn btn-danger ml-2" disabled={!libroMayor}>
            📄 PDF
          </button>
        </div>

        {cuentasAVisualizar.length > 0 ? (
          <div className="libro-mayor-container">
            {cuentasAVisualizar.map((mayor) => (
              <div key={mayor.cuenta.id} className="cuenta-section mb-4">
                <div className="card">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      {mayor.cuenta.codigo} - {mayor.cuenta.nombre}
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <table className="table table-bordered table-hover mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th>Fecha</th>
                          <th>Asiento</th>
                          <th>Descripción</th>
                          <th className="text-right">Debe</th>
                          <th className="text-right">Haber</th>
                          <th className="text-right">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mayor.movimientos.map((mov, idx) => (
                          <tr key={idx}>
                            <td>{new Date(mov.fecha).toLocaleDateString('es-BO')}</td>
                            <td>{mov.numeroAsiento}</td>
                            <td>{mov.descripcion}</td>
                            <td className="text-right">
                              {Number(mov.debe) > 0 ? Number(mov.debe).toFixed(2) : ''}
                            </td>
                            <td className="text-right">
                              {Number(mov.haber) > 0 ? Number(mov.haber).toFixed(2) : ''}
                            </td>
                            <td className="text-right font-weight-bold">
                              {Number(mov.saldo).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-light font-weight-bold">
                        <tr>
                          <td colSpan="3" className="text-right">TOTALES:</td>
                          <td className="text-right">
                            {Number(mayor.totalDebe || mayor.movimientos.reduce((s, m) => s + Number(m.debe), 0)).toFixed(2)}
                          </td>
                          <td className="text-right">
                            {Number(mayor.totalHaber || mayor.movimientos.reduce((s, m) => s + Number(m.haber), 0)).toFixed(2)}
                          </td>
                          <td className="text-right">
                            {Math.abs(mayor.saldoFinal).toFixed(2)}
                            <span className={mayor.saldoFinal >= 0 ? "text-success ml-1" : "text-danger ml-1"}>
                              ({mayor.saldoFinal >= 0 ? "Deudor" : "Acreedor"})
                            </span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-center mt-5">
            Seleccione un rango de fechas para ver el Libro Mayor
          </p>
        )}
      </div>
    );

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Plan de Cuentas</h3>
            <button onClick={generarPDF} className="btn btn-danger btn-sm">
              📄 Exportar PDF
            </button>
          </div>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Libro Diario</h3>
          <button onClick={generarPDF} className="btn btn-danger btn-sm" disabled={libroDiario.length === 0}>
            📄 Exportar PDF
          </button>
        </div>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Balance General</h3>
          <button onClick={generarPDF} className="btn btn-danger btn-sm" disabled={!balanceGeneral}>
            📄 Exportar PDF
          </button>
        </div>
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
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Estado de Resultados</h3>
          <button onClick={generarPDF} className="btn btn-danger btn-sm" disabled={!estadoResultados}>
            📄 Exportar PDF
          </button>
        </div>
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
  };

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
            className={`tab-btn ${vistaActual === "libro-mayor" ? "active" : ""
              }`}
            onClick={() => setVistaActual("libro-mayor")}
          >
            📚 Libro Mayor
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
          </button>
        </div>
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

        {
    estadoResultados ? (
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
    )
  }
      </div >
    );
  };

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
        className={`tab-btn ${vistaActual === "libro-mayor" ? "active" : ""
          }`}
        onClick={() => setVistaActual("libro-mayor")}
      >
        📚 Libro Mayor
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
      {vistaActual === "libro-mayor" && renderLibroMayor()}
      {vistaActual === "balance-general" && renderBalanceGeneral()}
      {vistaActual === "estado-resultados" && renderEstadoResultados()}
    </div>
  </div>
    </div >
  );
};

export default Contabilidad;
