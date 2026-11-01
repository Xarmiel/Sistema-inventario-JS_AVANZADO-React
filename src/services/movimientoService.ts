import type { Movimiento, NuevoMovimiento } from '../types/Movimiento';
import { getProductoById, actualizarProducto } from './productoService';

const API_URL = 'http://localhost:3001/movimientos';

export const getMovimientos = async (): Promise<Movimiento[]> => {
  const response = await fetch(`${API_URL}?_sort=id&_order=desc`);
  if (!response.ok) {
    throw new Error('Error al obtener los movimientos');
  }
  const data: Movimiento[] = await response.json();
  // Ordenar descendentemente por ID de forma segura
  return data.sort((a, b) => Number(b.id) - Number(a.id));
};

export const registrarMovimiento = async (
  movimiento: NuevoMovimiento,
  actualizarStockProducto: boolean = true
): Promise<Movimiento> => {
  // 1. Obtener todos los movimientos para asignar ID autoincremental
  const responseList = await fetch(API_URL);
  const todos: Movimiento[] = responseList.ok ? await responseList.json() : [];
  const maxId = todos.reduce((max, m) => (Number(m.id) > max ? Number(m.id) : max), 0);
  const nuevoId = maxId + 1;

  // 2. Si se solicita actualizar el stock del producto (registro manual o ajuste)
  if (actualizarStockProducto) {
    const productoActual = await getProductoById(movimiento.productoId);
    let nuevoStock = productoActual.stock;

    if (movimiento.tipo === 'ENTRADA') {
      nuevoStock += Number(movimiento.cantidad);
    } else {
      if (productoActual.stock < Number(movimiento.cantidad)) {
        throw new Error(`Stock insuficiente. Stock actual: ${productoActual.stock}, requerido: ${movimiento.cantidad}`);
      }
      nuevoStock -= Number(movimiento.cantidad);
    }

    await actualizarProducto(movimiento.productoId, { stock: nuevoStock });
  }

  // 3. Registrar el movimiento en la colección
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...movimiento,
      id: nuevoId,
      cantidad: Number(movimiento.cantidad)
    })
  });

  if (!response.ok) {
    throw new Error('Error al guardar el movimiento');
  }

  return response.json();
};
