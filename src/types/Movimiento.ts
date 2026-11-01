export type TipoMovimiento = 'ENTRADA' | 'SALIDA';

export interface Movimiento {
  id: number;
  productoId: number;
  productoNombre: string;
  tipo: TipoMovimiento;
  cantidad: number;
  fecha: string;
  motivo?: string;
}

export type NuevoMovimiento = Omit<Movimiento, 'id'>;
