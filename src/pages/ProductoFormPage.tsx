import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { crearProducto, getProductoById, actualizarProducto } from '../services/productoService';
import { registrarMovimiento } from '../services/movimientoService';

export const ProductoFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdicion = Boolean(id);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [stock, setStock] = useState<number | ''>(0);
  const [precio, setPrecio] = useState<number | ''>('');
  const [stockOriginal, setStockOriginal] = useState<number>(0);

  const [cargando, setCargando] = useState<boolean>(false);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdicion && id) {
      setCargando(true);
      getProductoById(Number(id))
        .then(prod => {
          setNombre(prod.nombre);
          setCategoria(prod.categoria);
          setStock(prod.stock);
          setPrecio(prod.precio);
          setStockOriginal(prod.stock);
        })
        .catch(err => {
          setError(err.message || 'Error al cargar el producto para edición');
        })
        .finally(() => {
          setCargando(false);
        });
    }
  }, [id, isEdicion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('El nombre del producto es obligatorio.');
      return;
    }
    if (!categoria.trim()) {
      setError('La categoría es obligatoria.');
      return;
    }
    if (stock === '' || Number(stock) < 0) {
      setError('El stock debe ser un número entero mayor o igual a cero.');
      return;
    }
    if (precio === '' || Number(precio) <= 0) {
      setError('El precio debe ser un número mayor a cero.');
      return;
    }

    try {
      setGuardando(true);
      const stockNum = Math.floor(Number(stock));
      const precioNum = Number(precio);
      const fechaActual = new Date().toISOString().replace('T', ' ').slice(0, 19);

      if (isEdicion && id) {
        const prodId = Number(id);
        await actualizarProducto(prodId, {
          nombre: nombre.trim(),
          categoria: categoria.trim(),
          stock: stockNum,
          precio: precioNum
        });

        // Registrar movimiento automático si hubo alteración directa del stock
        const diferenciaStock = stockNum - stockOriginal;
        if (diferenciaStock !== 0) {
          await registrarMovimiento(
            {
              productoId: prodId,
              productoNombre: nombre.trim(),
              tipo: diferenciaStock > 0 ? 'ENTRADA' : 'SALIDA',
              cantidad: Math.abs(diferenciaStock),
              fecha: fechaActual,
              motivo: `Ajuste automático por edición de producto (${diferenciaStock > 0 ? '+' : ''}${diferenciaStock} uds)`
            },
            false // No actualizar stock de nuevo porque ya fue actualizado arriba
          );
        }
      } else {
        // Modo Creación
        const nuevoProd = await crearProducto({
          nombre: nombre.trim(),
          categoria: categoria.trim(),
          stock: stockNum,
          precio: precioNum
        });

        // Registrar movimiento automático de entrada inicial si el stock es mayor a 0
        if (stockNum > 0) {
          await registrarMovimiento(
            {
              productoId: nuevoProd.id,
              productoNombre: nuevoProd.nombre,
              tipo: 'ENTRADA',
              cantidad: stockNum,
              fecha: fechaActual,
              motivo: 'Registro inicial de producto (Automático)'
            },
            false // Ya el producto se guardó con su stock
          );
        }
      }

      navigate('/productos');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado al guardar el producto');
      }
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Cargando datos del producto...</p>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h4 className="fw-bold mb-0">
              <i className={`bi ${isEdicion ? 'bi-pencil-square text-primary' : 'bi-plus-circle-fill text-success'} me-2`}></i>
              {isEdicion ? `Editar Producto #${id}` : 'Registrar Nuevo Producto'}
            </h4>
          </div>
          <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Nombre del Producto <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Teclado Mecánico Inalámbrico"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Categoría <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Periféricos, Electrónica, etc."
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Stock {isEdicion ? 'Actual' : 'Inicial'} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="form-control"
                    placeholder="0"
                    value={stock}
                    onChange={e => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                  />
                  <small className="text-muted">
                    {isEdicion ? 'Modificarlo creará un movimiento de ajuste.' : 'Generará un movimiento automático si es > 0.'}
                  </small>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Precio Unitario (S/) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">S/</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="form-control"
                      placeholder="0.00"
                      value={precio}
                      onChange={e => setPrecio(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2 border-top">
                <Link to="/productos" className="btn btn-outline-secondary">
                  Cancelar
                </Link>
                <button type="submit" className="btn btn-primary px-4" disabled={guardando}>
                  {guardando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i> Guardar Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
