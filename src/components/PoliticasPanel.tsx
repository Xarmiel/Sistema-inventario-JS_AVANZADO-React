import React, { use } from 'react';
import { politicasPromise, type PoliticaInventario } from '../resources/politicasResource';

export const PoliticasPanel: React.FC = () => {
  // Uso de use(resource) introducido en React 19 para lectura declarativa bajo Suspense (S13)
  const politicas: PoliticaInventario[] = use(politicasPromise);

  return (
    <div className="card shadow-sm border-0 mb-4 border-start border-4 border-info">
      <div className="card-header bg-transparent py-2 d-flex align-items-center gap-2">
        <i className="bi bi-shield-check text-info fs-5"></i>
        <h6 className="mb-0 fw-bold">Políticas y Reglas SLA de Almacén</h6>
      </div>
      <div className="card-body py-2">
        <div className="row g-2">
          {politicas.map((pol, idx) => (
            <div key={idx} className="col-md-6">
              <div className="p-2 rounded bg-light border">
                <div className="fw-semibold small text-primary">{pol.titulo}</div>
                <div className="small text-secondary">{pol.detalle}</div>
                <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                  <i className="bi bi-clock-history me-1"></i>
                  {pol.vigencia}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

