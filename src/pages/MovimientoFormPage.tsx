import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import type { TipoMovimiento } from '../types/Movimiento';
import { getProductos } from '../services/productoService';
import { registrarMovimiento } from '../services/movimientoService';

export const MovimientoFormPage: React.FC = () => {
  const navigate = useNavigate();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<number | ''>('');
  const [tipo, setTipo] = useState<TipoMovimiento>('ENTRADA');
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [motivo, setMotivo] = useState<string>('');

  const [cargando, setCargando] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductos()
      .then(data => {
        setProductos(data);
        if (data.length > 0) {
          setProductoSeleccionadoId(data[0].id);
        }
      })
      .catch(err => {
        setError(err.message || 'Error al cargar los productos');
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const productoActual = productos.find(p => p.id === Number(productoSeleccionadoId));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!productoSeleccionadoId || !productoActual) {
      setError('Debes seleccionar un producto válido.');
      return;
    }
    if (cantidad === '' || Number(cantidad) <= 0) {
      setError('La cantidad debe ser un número entero mayor a 0.');
      return;
    }

    const cantidadNum = Math.floor(Number(cantidad));

    if (tipo === 'SALIDA' && productoActual.stock < cantidadNum) {
      setError(`Stock insuficiente. Solo quedan ${productoActual.stock} unidades de "${productoActual.nombre}".`);
      return;
    }

    try {
      setGuardando(true);
      const fechaActual = new Date().toISOString().replace('T', ' ').slice(0, 19);

      await registrarMovimiento(
        {
          productoId: productoActual.id,
          productoNombre: productoActual.nombre,
          tipo,
          cantidad: cantidadNum,
          fecha: fechaActual,
          motivo: motivo.trim() || `Movimiento manual de ${tipo.toLowerCase()}`
        },
        true // Aplica la deducción o adición en el stock del producto
      );

      navigate('/movimientos');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al registrar el movimiento');
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h4 className="fw-bold mb-0">
              <i className="bi bi-arrow-left-right text-warning me-2"></i>
              Registrar Movimiento Manual
            </h4>
          </div>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {productos.length === 0 ? (
              <div className="alert alert-warning" role="alert">
                No hay productos registrados en el inventario. Primero registra un producto.
                <div className="mt-2">
                  <Link to="/productos/nuevo" className="btn btn-sm btn-primary">
                    Ir a Registrar Producto
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Selección del producto */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Producto <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={productoSeleccionadoId}
                    onChange={e => setProductoSeleccionadoId(Number(e.target.value))}
                    required
                  >
                    {productos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} (Stock actual: {p.stock} | S/ {Number(p.precio).toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {productoActual && (
                    <div className="form-text">
                      Stock disponible: <strong className="text-dark">{productoActual.stock} unidades</strong>
                    </div>
                  )}
                </div>

                {/* Tipo de movimiento */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tipo de Movimiento <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoMovimiento"
                        id="tipoEntrada"
                        value="ENTRADA"
                        checked={tipo === 'ENTRADA'}
                        onChange={() => setTipo('ENTRADA')}
                      />
                      <label className="form-check-label text-success fw-medium" htmlFor="tipoEntrada">
                        <i className="bi bi-arrow-down-left me-1"></i> Entrada (Aumenta stock)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoMovimiento"
                        id="tipoSalida"
                        value="SALIDA"
                        checked={tipo === 'SALIDA'}
                        onChange={() => setTipo('SALIDA')}
                      />
                      <label className="form-check-label text-danger fw-medium" htmlFor="tipoSalida">
                        <i className="bi bi-arrow-up-right me-1"></i> Salida (Disminuye stock)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cantidad */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Cantidad <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="form-control"
                    placeholder="Ej: 5"
                    value={cantidad}
                    onChange={e => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                </div>

                {/* Motivo o justificación */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Motivo / Observación (Opcional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ej: Reposición de lote, venta directa, devolución, merma..."
                    value={motivo}
                    onChange={e => setMotivo(e.target.value)}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                  <Link to="/movimientos" className="btn btn-outline-secondary">
                    Cancelar
                  </Link>
                  <button type="submit" className="btn btn-warning fw-semibold px-4" disabled={guardando}>
                    {guardando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Registrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle me-1"></i> Confirmar Movimiento
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
