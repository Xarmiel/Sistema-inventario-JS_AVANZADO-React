import React from 'react';

interface Props {
  mensaje: string;
  onReintentar?: () => void;
}

export const AlertaError: React.FC<Props> = ({ mensaje, onReintentar }) => (
  <div className="alert alert-danger d-flex align-items-center justify-content-between gap-2" role="alert">
    <span>
      <i className="bi bi-exclamation-triangle-fill me-2"></i>
      {mensaje}
    </span>
    {onReintentar && (
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={onReintentar}>
        <i className="bi bi-arrow-clockwise me-1"></i> Reintentar
      </button>
    )}
  </div>
);
