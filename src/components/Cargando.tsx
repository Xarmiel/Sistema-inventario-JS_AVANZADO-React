import React from 'react';

export const Cargando: React.FC<{ mensaje: string }> = ({ mensaje }) => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status"></div>
    <p className="mt-2 text-muted">{mensaje}</p>
  </div>
);
