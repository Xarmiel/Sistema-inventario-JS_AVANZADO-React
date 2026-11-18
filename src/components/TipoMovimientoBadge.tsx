import React from 'react';
import type { TipoMovimiento } from '../types/Movimiento';

export const TipoMovimientoBadge: React.FC<{ tipo: TipoMovimiento }> = ({ tipo }) =>
  tipo === 'ENTRADA' ? (
    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
      <i className="bi bi-arrow-down-left me-1"></i> Entrada
    </span>
  ) : (
    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">
      <i className="bi bi-arrow-up-right me-1"></i> Salida
    </span>
  );
