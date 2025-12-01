import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Obtiene el color del badge según el tipo de cuenta
 * @param {string} tipo - Tipo de cuenta (ACTIVO, PASIVO, PATRIMONIO, INGRESO, GASTO)
 * @returns {string} Clase CSS del badge
 */
export const getTipoBadge = (tipo) => {
    const badges = {
        ACTIVO: "info",
        PASIVO: "warning",
        PATRIMONIO: "success",
        INGRESO: "success",
        GASTO: "danger",
    };
    return badges[tipo] || "secondary";
};

/**
 * Obtiene el color del badge según el estado del asiento
 * @param {string} estado - Estado del asiento (BORRADOR, APROBADO, ANULADO)
 * @returns {string} Clase CSS del badge
 */
export const getEstadoBadge = (estado) => {
    const badges = {
        BORRADOR: "warning",
        APROBADO: "success",
        ANULADO: "danger",
    };
    return badges[estado] || "secondary";
};

/**
 * Genera un PDF del reporte contable seleccionado
 * @param {string} vistaActual - Vista actual seleccionada
 * @param {Object} datos - Datos del reporte a generar
 * @param {Object} fechas - Objeto con fechaInicio y fechaFin
 */
export const generarPDF = (vistaActual, datos, fechas) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const { fechaInicio, fechaFin, planCuentas, libroDiario, libroMayor, balanceGeneral, estadoResultados } = datos;

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
