import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { ProductosPage } from './pages/ProductosPage';
import { ProductoFormPage } from './pages/ProductoFormPage';
import { MovimientosPage } from './pages/MovimientosPage';
import { MovimientoFormPage } from './pages/MovimientoFormPage';

export const App: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/productos/nuevo" element={<ProductoFormPage />} />
          <Route path="/productos/editar/:id" element={<ProductoFormPage />} />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route path="/movimientos/nuevo" element={<MovimientoFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="bg-white border-top py-3 text-center text-muted small mt-auto">
        <div className="container">
          Sistema de Gestión de Inventario &bull; React + TypeScript + Bootstrap
        </div>
      </footer>
    </div>
  );
};

export default App;
