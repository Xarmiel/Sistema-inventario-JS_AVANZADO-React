import api from './api';
import type { Producto, NuevoProducto } from '../types/Producto';

const ENDPOINT = '/productos';

export const getProductos = async (): Promise<Producto[]> => {
  const { data } = await api.get<Producto[]>(ENDPOINT);
  return data;
};

export const getProductoById = async (id: number): Promise<Producto> => {
  const { data } = await api.get<Producto>(`${ENDPOINT}/${id}`);
  return data;
};

export const crearProducto = async (producto: NuevoProducto): Promise<Producto> => {
  // Obtener lista para calcular el ID autoincremental de manera segura
  const { data: todos } = await api.get<Producto[]>(ENDPOINT);
  const maxId = todos.reduce((max, p) => (Number(p.id) > max ? Number(p.id) : max), 0);
  const nuevoId = maxId + 1;

  const { data } = await api.post<Producto>(ENDPOINT, {
    ...producto,
    id: nuevoId,
    stock: Number(producto.stock),
    precio: Number(producto.precio)
  });

  return data;
};

export const actualizarProducto = async (id: number, datos: Partial<Producto>): Promise<Producto> => {
  const payload = {
    ...datos,
    ...(datos.stock !== undefined ? { stock: Number(datos.stock) } : {}),
    ...(datos.precio !== undefined ? { precio: Number(datos.precio) } : {})
  };

  const { data } = await api.patch<Producto>(`${ENDPOINT}/${id}`, payload);
  return data;
};

export const eliminarProducto = async (id: number): Promise<void> => {
  await api.delete(`${ENDPOINT}/${id}`);
};
