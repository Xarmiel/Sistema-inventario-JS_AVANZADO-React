import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Movimiento } from '../types/Movimiento';
import { getMovimientos } from '../services/movimientoService';

export const MovimientosPage: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        const data = await getMovimientos();
        setMovimientos(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar el historial de movimientos');
        }
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const movimientosFiltrados = movimientos.filter(m => {
    const coincideTipo = filtroTipo === 'TODOS' || m.tipo === filtroTipo;
    const coincideTexto = m.productoNombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                          String(m.productoId).includes(filtroTexto) ||
                          (m.motivo && m.motivo.toLowerCase().includes(filtroTexto.toLowerCase()));
    return coincideTipo && coincideTexto;
  });

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Movimientos de Inventario</h2>
          <p className="text-muted mb-0">Registro y trazabilidad de entradas y salidas de stock</p>
        </div>
        <Link to="/movimientos/nuevo" className="btn btn-warning fw-semibold text-dark d-inline-flex align-items-center gap-2">
          <i className="bi bi-plus-circle-fill"></i> Registrar Movimiento Manual
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por producto, ID o motivo..."
                  value={filtroTexto}
                  onChange={e => setFiltroTexto(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtroTipo}
                onChange={e => setFiltroTipo(e.target.value)}
              >
                <option value="TODOS">Todos los tipos (Entradas y Salidas)</option>
                <option value="ENTRADA">Solo Entradas (+)</option>
                <option value="SALIDA">Solo Salidas (-)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Cargando movimientos...</p>
            </div>
          ) : movimientosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted"></i>
              <p className="mt-2 text-muted">No se registraron movimientos con ese criterio.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '80px' }}>ID</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Fecha y Hora</th>
                    <th scope="col">Motivo / Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFiltrados.map(m => (
                    <tr key={m.id}>
                      <td className="fw-bold text-muted">#{m.id}</td>
                      <td>
                        {m.tipo === 'ENTRADA' ? (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                            <i className="bi bi-arrow-down-left me-1"></i> ENTRADA
                          </span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
                            <i className="bi bi-arrow-up-right me-1"></i> SALIDA
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">{m.productoNombre}</span>
                        <span className="text-muted small ms-2">(ID: {m.productoId})</span>
                      </td>
                      <td>
                        <span className={`fw-bold ${m.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'}`}>
                          {m.tipo === 'ENTRADA' ? `+${m.cantidad}` : `-${m.cantidad}`}
                        </span>{' '}
                        uds.
                      </td>
                      <td className="text-muted small">{m.fecha}</td>
                      <td>
                        <span className="small text-secondary">{m.motivo || 'Sin detalle'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
