import { useState, useEffect } from 'react';
import ContabilidadService from '../../services/ContabilidadService';
import './AsientosContables.css';

const AsientosContables = () => {
    const [planCuentas, setPlanCuentas] = useState([]);
    const [detalles, setDetalles] = useState([
        { cuentaId: '', descripcion: '', debe: '', haber: '' }
    ]);
    const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarPlanCuentas();
    }, []);

    const cargarPlanCuentas = async () => {
        try {
            const response = await ContabilidadService.obtenerPlanCuentas();
            if (response.exito) {
                setPlanCuentas(response.datos.filter(c => c.permiteMovimiento));
            }
        } catch (error) {
            console.error('Error al cargar plan de cuentas:', error);
        }
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { cuentaId: '', descripcion: '', debe: '', haber: '' }]);
    };

    const eliminarDetalle = (index) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const actualizarDetalle = (index, campo, valor) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][campo] = valor;

        if (campo === 'debe' && valor) {
            nuevosDetalles[index].haber = '';
        } else if (campo === 'haber' && valor) {
            nuevosDetalles[index].debe = '';
        }

        setDetalles(nuevosDetalles);
    };

    const calcularTotales = () => {
        const totalDebe = detalles.reduce((sum, d) => sum + (parseFloat(d.debe) || 0), 0);
        const totalHaber = detalles.reduce((sum, d) => sum + (parseFloat(d.haber) || 0), 0);
        return { totalDebe, totalHaber, diferencia: totalDebe - totalHaber };
    };

    const validarAsiento = () => {
        const { diferencia } = calcularTotales();

        if (Math.abs(diferencia) > 0.01) {
            alert('El asiento no está balanceado. Debe = Haber');
            return false;
        }

        if (!descripcion.trim()) {
            alert('Ingrese una descripción para el asiento');
            return false;
        }

        const detallesValidos = detalles.filter(d =>
            d.cuentaId && (parseFloat(d.debe) > 0 || parseFloat(d.haber) > 0)
        );

        if (detallesValidos.length < 2) {
            alert('Un asiento debe tener al menos 2 cuentas');
            return false;
        }

        return true;
    };

    const handleCrearAsiento = async (e) => {
        e.preventDefault();

        if (!validarAsiento()) return;

        setLoading(true);
        try {
            const asientoData = {
                fecha_asiento: fecha,
                descripcion: descripcion,
                tipo: 'OPERACION',
                detalles: detalles
                    .filter(d => d.cuentaId && (parseFloat(d.debe) > 0 || parseFloat(d.haber) > 0))
                    .map((d, idx) => ({
                        cuentaId: parseInt(d.cuentaId),
                        debe: parseFloat(d.debe) || 0,
                        haber: parseFloat(d.haber) || 0,
                        descripcion: d.descripcion || descripcion,
                        numero_linea: idx + 1
                    }))
            };

            const response = await ContabilidadService.crearAsiento(asientoData);

            if (response.exito) {
                alert('Asiento contable creado exitosamente');
                setDescripcion('');
                setDetalles([{ cuentaId: '', descripcion: '', debe: '', haber: '' }]);
            }
        } catch (error) {
            console.error('Error al crear asiento:', error);
            alert('Error al crear el asiento contable: ' + (error.mensaje || error.message));
        } finally {
            setLoading(false);
        }
    };

    const { totalDebe, totalHaber, diferencia } = calcularTotales();
    const estaBalanceado = Math.abs(diferencia) < 0.01;

    return (
        <div className="asientos-contables-page">
            <h2>Asientos Contables Manuales</h2>
            <p className="text-muted">Registre movimientos contables manuales (aportes de capital, compra de activos, gastos, préstamos, etc.)</p>

            <form onSubmit={handleCrearAsiento} className="asiento-form">
                <div className="form-header">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Fecha:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Descripción del Asiento:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Ej: Aporte inicial de capital"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detalles-section">
                    <h4>Detalles del Asiento</h4>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th style={{ width: '35%' }}>Cuenta</th>
                                    <th style={{ width: '30%' }}>Descripción</th>
                                    <th style={{ width: '15%' }}>Debe</th>
                                    <th style={{ width: '15%' }}>Haber</th>
                                    <th style={{ width: '5%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td>
                                            <select
                                                className="form-control"
                                                value={detalle.cuentaId}
                                                onChange={(e) => actualizarDetalle(index, 'cuentaId', e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccione una cuenta</option>
                                                {planCuentas.map(cuenta => (
                                                    <option key={cuenta.id} value={cuenta.id}>
                                                        {cuenta.codigo} - {cuenta.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={detalle.descripcion}
                                                onChange={(e) => actualizarDetalle(index, 'descripcion', e.target.value)}
                                                placeholder="Opcional"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="form-control text-right"
                                                value={detalle.debe}
                                                onChange={(e) => actualizarDetalle(index, 'debe', e.target.value)}
                                                disabled={!!detalle.haber}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="form-control text-right"
                                                value={detalle.haber}
                                                onChange={(e) => actualizarDetalle(index, 'haber', e.target.value)}
                                                disabled={!!detalle.debe}
                                            />
                                        </td>
                                        <td>
                                            {detalles.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => eliminarDetalle(index)}
                                                >
                                                    &times;
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-weight-bold">
                                    <td colSpan="2" className="text-right">TOTALES:</td>
                                    <td className="text-right">{totalDebe.toFixed(2)}</td>
                                    <td className="text-right">{totalHaber.toFixed(2)}</td>
                                    <td></td>
                                </tr>
                                <tr className={estaBalanceado ? 'table-success' : 'table-warning'}>
                                    <td colSpan="2" className="text-right">
                                        {estaBalanceado ? '✓ Asiento Balanceado' : '⚠ Diferencia:'}
                                    </td>
                                    <td colSpan="2" className="text-right font-weight-bold">
                                        {!estaBalanceado && Math.abs(diferencia).toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={agregarDetalle}
                    >
                        + Agregar Detalle
                    </button>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading || !estaBalanceado}
                    >
                        {loading ? 'Guardando...' : 'Crear Asiento Contable'}
                    </button>
                </div>
            </form>

            <div className="alert alert-info mt-4">
                <strong>💡 Ejemplos de asientos contables:</strong>
                <ul className="mb-0">
                    <li><strong>Aporte de capital:</strong> Debe: Caja, Haber: Capital</li>
                    <li><strong>Compra de activo:</strong> Debe: Activo Fijo, Haber: Caja/Banco</li>
                    <li><strong>Pago de gasto:</strong> Debe: Gasto, Haber: Caja</li>
                    <li><strong>Préstamo recibido:</strong> Debe: Banco, Haber: Préstamos por Pagar</li>
                </ul>
            </div>
        </div>
    );
};

export default AsientosContables;
