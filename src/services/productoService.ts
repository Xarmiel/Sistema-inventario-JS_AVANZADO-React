import type { Producto, NuevoProducto } from '../types/Producto';

const API_URL = 'http://localhost:3001/productos';

export const getProductos = async (): Promise<Producto[]> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Error al obtener la lista de productos');
  }
  return response.json();
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error(`Producto con ID ${id} no encontrado`);
  }
  return response.json();
};

export const crearProducto = async (producto: NuevoProducto): Promise<Producto> => {
  // Obtener todos para calcular el siguiente ID numérico autoincremental
  const todos = await getProductos();
  const maxId = todos.reduce((max, p) => (Number(p.id) > max ? Number(p.id) : max), 0);
  const nuevoId = maxId + 1;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...producto,
      id: nuevoId,
      stock: Number(producto.stock),
      precio: Number(producto.precio)
    })
  });

  if (!response.ok) {
    throw new Error('Error al registrar el producto');
  }
  return response.json();
};

export const actualizarProducto = async (id: number, datos: Partial<Producto>): Promise<Producto> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...datos,
      ...(datos.stock !== undefined ? { stock: Number(datos.stock) } : {}),
      ...(datos.precio !== undefined ? { precio: Number(datos.precio) } : {})
    })
  });

  if (!response.ok) {
    throw new Error(`Error al actualizar el producto con ID ${id}`);
  }
  return response.json();
};

export const eliminarProducto = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar el producto con ID ${id}`);
  }
};
