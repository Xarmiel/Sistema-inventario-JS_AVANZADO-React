import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ProductosPage } from './pages/ProductosPage';
import { ProductoFormPage } from './pages/ProductoFormPage';
import { MovimientosPage } from './pages/MovimientosPage';
import { MovimientoFormPage } from './pages/MovimientoFormPage';
import { ThemeProvider } from './context/ThemeContext';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container py-4 flex-grow-1">
          <Suspense
            fallback={
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Cargando componentes...</p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/productos/nuevo" element={<ProductoFormPage />} />
              <Route path="/productos/editar/:id" element={<ProductoFormPage />} />
              <Route path="/movimientos" element={<MovimientosPage />} />
              <Route path="/movimientos/nuevo" element={<MovimientoFormPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <footer className="border-top py-3 text-center text-muted small mt-auto">
          <div className="container">
            Sistema de Gestión de Inventario &bull; React + Axios + TypeScript + Bootstrap
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
