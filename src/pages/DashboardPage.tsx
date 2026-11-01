import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import type { Movimiento } from '../types/Movimiento';
import { getProductos } from '../services/productoService';
import { getMovimientos } from '../services/movimientoService';

export const DashboardPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, movs] = await Promise.all([getProductos(), getMovimientos()]);
        setProductos(prods);
        setMovimientos(movs);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error de conexión con la base de datos');
        }
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, []);

  const totalProductos = productos.length;
  const totalStock = productos.reduce((acc, p) => acc + Number(p.stock), 0);
  const valorInventario = productos.reduce((acc, p) => acc + Number(p.stock) * Number(p.precio), 0);
  const productosBajoStock = productos.filter(p => Number(p.stock) <= 5);

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Cargando métricas del inventario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Panel de Control (Dashboard)</h2>
          <p className="text-muted mb-0">Resumen y estado global del inventario</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/productos/nuevo" className="btn btn-primary">
            <i className="bi bi-plus-lg me-1"></i> Nuevo Producto
          </Link>
          <Link to="/movimientos/nuevo" className="btn btn-outline-dark">
            <i className="bi bi-arrow-left-right me-1"></i> Movimiento
          </Link>
        </div>
      </div>

      {/* Tarjetas de métricas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4 h-100">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Total Productos</div>
              <div className="fs-3 fw-bold mt-1 text-primary">{totalProductos}</div>
              <small className="text-muted">Artículos registrados</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4 h-100">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Unidades Totales</div>
              <div className="fs-3 fw-bold mt-1 text-success">{totalStock}</div>
              <small className="text-muted">Stock acumulado</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-info border-4 h-100">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Valor Total</div>
              <div className="fs-3 fw-bold mt-1 text-info">S/ {valorInventario.toFixed(2)}</div>
              <small className="text-muted">Valuación estimada</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4 h-100">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Alerta Bajo Stock</div>
              <div className="fs-3 fw-bold mt-1 text-warning">{productosBajoStock.length}</div>
              <small className="text-muted">Menor o igual a 5 unidades</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Últimos movimientos */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Últimos Movimientos</h5>
              <Link to="/movimientos" className="text-decoration-none small">
                Ver todos <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Tipo</th>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.slice(0, 5).map(m => (
                      <tr key={m.id}>
                        <td>
                          {m.tipo === 'ENTRADA' ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              <i className="bi bi-arrow-down-left me-1"></i> Entrada
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
                              <i className="bi bi-arrow-up-right me-1"></i> Salida
                            </span>
                          )}
                        </td>
                        <td className="fw-medium">{m.productoNombre}</td>
                        <td>{m.cantidad} uds.</td>
                        <td className="text-muted small">{m.fecha}</td>
                      </tr>
                    ))}
                    {movimientos.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          No hay movimientos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Artículos en riesgo */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold text-danger">
                <i className="bi bi-exclamation-octagon me-2"></i>Stock Crítico
              </h5>
            </div>
            <div className="card-body">
              {productosBajoStock.length === 0 ? (
                <p className="text-muted small mb-0">¡Todo en orden! No hay productos con stock crítico.</p>
              ) : (
                <ul className="list-group list-group-flush">
                  {productosBajoStock.map(p => (
                    <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <div>
                        <div className="fw-medium">{p.nombre}</div>
                        <small className="text-muted">{p.categoria}</small>
                      </div>
                      <span className="badge bg-danger rounded-pill">{p.stock} uds</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
