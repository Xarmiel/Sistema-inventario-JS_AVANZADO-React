import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Producto } from '../types/Producto';
import { getProductos, eliminarProducto } from '../services/productoService';
import { StockBadge } from '../components/StockBadge';

export const ProductosPage: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [filtroTexto, setFiltroTexto] = useState<string>('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('TODAS');
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'danger'; texto: string } | null>(null);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const data = await getProductos();
      setProductos(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMensaje({ tipo: 'danger', texto: err.message });
      } else {
        setMensaje({ tipo: 'danger', texto: 'Error al conectar con la base de datos' });
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleEliminar = async (id: number, nombre: string) => {
    const confirmado = window.confirm(`¿Estás seguro de eliminar el producto "${nombre}" (ID: ${id})?`);
    if (!confirmado) return;

    try {
      await eliminarProducto(id);
      setMensaje({ tipo: 'success', texto: `Producto "${nombre}" eliminado con éxito.` });
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMensaje({ tipo: 'danger', texto: err.message });
      } else {
        setMensaje({ tipo: 'danger', texto: 'No se pudo eliminar el producto' });
      }
    }
  };

  const categorias = ['TODAS', ...Array.from(new Set(productos.map(p => p.categoria)))];

  const productosFiltrados = productos.filter(p => {
    const coincideNombre = p.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                           p.categoria.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                           String(p.id).includes(filtroTexto);
    const coincideCategoria = categoriaSeleccionada === 'TODAS' || p.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Catálogo de Productos</h2>
          <p className="text-muted mb-0">Gestión de stock, precios y categorías</p>
        </div>
        <Link to="/productos/nuevo" className="btn btn-primary d-inline-flex align-items-center gap-2">
          <i className="bi bi-plus-circle-fill"></i> Registrar Producto
        </Link>
      </div>

      {mensaje && (
        <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
          {mensaje.texto}
          <button type="button" className="btn-close" onClick={() => setMensaje(null)} aria-label="Close"></button>
        </div>
      )}

      {/* Barra de filtros */}
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
                  placeholder="Buscar por ID, nombre o categoría..."
                  value={filtroTexto}
                  onChange={e => setFiltroTexto(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={categoriaSeleccionada}
                onChange={e => setCategoriaSeleccionada(e.target.value)}
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    Categoría: {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {cargando ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2 text-muted">Cargando catálogo...</p>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-box-seam fs-1 text-muted"></i>
              <p className="mt-2 text-muted">No se encontraron productos registrados.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" style={{ width: '80px' }}>ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Categoría</th>
                    <th scope="col">Stock</th>
                    <th scope="col">Precio</th>
                    <th scope="col" className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map(p => (
                    <tr key={p.id}>
                      <td className="fw-bold text-muted">#{p.id}</td>
                      <td>
                        <span className="fw-semibold text-dark">{p.nombre}</span>
                      </td>
                      <td>
                        <span className="badge bg-secondary-subtle text-dark border">
                          {p.categoria}
                        </span>
                      </td>
                      <td>
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className="fw-bold text-dark">
                        S/ {Number(p.precio).toFixed(2)}
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/productos/editar/${p.id}`}
                            className="btn btn-outline-primary"
                            title="Editar Producto"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Eliminar Producto"
                            onClick={() => handleEliminar(p.id, p.nombre)}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
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
