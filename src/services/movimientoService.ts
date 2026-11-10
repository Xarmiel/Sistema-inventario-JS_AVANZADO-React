import api from './api';
import type { Movimiento, NuevoMovimiento } from '../types/Movimiento';
import { getProductoById, actualizarProducto } from './productoService';

const ENDPOINT = '/movimientos';

export const getMovimientos = async (): Promise<Movimiento[]> => {
  const { data } = await api.get<Movimiento[]>(`${ENDPOINT}?_sort=id&_order=desc`);
  // Ordenar descendentemente por ID de forma segura
  return [...data].sort((a, b) => Number(b.id) - Number(a.id));
};

export const registrarMovimiento = async (
  movimiento: NuevoMovimiento,
  actualizarStockProducto: boolean = true
): Promise<Movimiento> => {
  // 1. Obtener todos los movimientos para asignar ID autoincremental
  const { data: todos } = await api.get<Movimiento[]>(ENDPOINT);
  const maxId = todos.reduce((max, m) => (Number(m.id) > max ? Number(m.id) : max), 0);
  const nuevoId = maxId + 1;

  // 2. Si se requiere actualizar el stock del producto asociado
  if (actualizarStockProducto) {
    const productoActual = await getProductoById(movimiento.productoId);
    let nuevoStock = productoActual.stock;

    if (movimiento.tipo === 'ENTRADA') {
      nuevoStock += Number(movimiento.cantidad);
    } else {
      if (productoActual.stock < Number(movimiento.cantidad)) {
        throw new Error(
          `Stock insuficiente. Stock actual: ${productoActual.stock}, requerido: ${movimiento.cantidad}`
        );
      }
      nuevoStock -= Number(movimiento.cantidad);
    }

    await actualizarProducto(movimiento.productoId, { stock: nuevoStock });
  }

  // 3. Registrar el movimiento vía POST con Axios
  const { data } = await api.post<Movimiento>(ENDPOINT, {
    ...movimiento,
    id: nuevoId,
    cantidad: Number(movimiento.cantidad)
  });

  return data;
};
