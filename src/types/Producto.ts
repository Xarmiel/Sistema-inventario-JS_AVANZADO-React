export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
}

export type NuevoProducto = Omit<Producto, 'id'>;
