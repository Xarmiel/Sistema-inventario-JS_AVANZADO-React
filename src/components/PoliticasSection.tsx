import React, { Suspense } from 'react';
import { PoliticasPanel } from '../components/PoliticasPanel';

export const PoliticasSection: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="card shadow-sm border-0 mb-4 p-3 text-center text-muted">
          <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
          <span>Cargando políticas y SLA de inventario desde recurso...</span>
        </div>
      }
    >
      <PoliticasPanel />
    </Suspense>
  );
};

