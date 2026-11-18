import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  const { pathname } = useLocation();
  return (
    <div className="text-center py-5">
      <i className="bi bi-signpost-split fs-1 text-muted"></i>
      <h2 className="fw-bold mt-3">404 · Página no encontrada</h2>
      <p className="text-muted">
        La ruta <code>{pathname}</code> no existe en el sistema.
      </p>
      <Link to="/" className="btn btn-primary">
        <i className="bi bi-house me-1"></i> Volver al Dashboard
      </Link>
    </div>
  );
};
