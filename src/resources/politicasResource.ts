// Recurso asíncrono para anuncios / políticas de inventario cargadas fuera del componente
export interface PoliticaInventario {
  titulo: string;
  detalle: string;
  vigencia: string;
}

export const politicasPromise: Promise<PoliticaInventario[]> = new Promise(resolve => {
  setTimeout(() => {
    resolve([
      {
        titulo: 'Regla SLA de Reabastecimiento',
        detalle: 'Todo producto con stock crítico (≤ 5 unidades) debe emitir una orden de entrada en menos de 24 horas.',
        vigencia: 'Vigente ciclo 2026-I'
      },
      {
        titulo: 'Auditoría de Movimientos',
        detalle: 'Las salidas de stock sin motivo justificado serán marcadas para revisión por jefatura de almacén.',
        vigencia: 'Normativa institucional'
      }
    ]);
  }, 1200);
});

