import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <i className="bi bi-box-seam-fill text-warning fs-4"></i>
          <span>InventarioPro</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-1">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                end
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/productos"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
              >
                <i className="bi bi-boxes me-1"></i> Productos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/movimientos"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
              >
                <i className="bi bi-arrow-left-right me-1"></i> Movimientos
              </NavLink>
            </li>
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <Link to="/movimientos/nuevo" className="btn btn-warning btn-sm fw-semibold text-dark">
                <i className="bi bi-plus-circle me-1"></i> Registrar Movimiento
              </Link>
            </li>
            {/* Control de Tema con Context (Semana 13) */}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <button
                type="button"
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-1"
                onClick={toggleTheme}
                title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
              >
                {theme === 'dark' ? (
                  <>
                    <i className="bi bi-sun-fill text-warning"></i>
                    <span className="small">Claro</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-moon-stars-fill text-info"></i>
                    <span className="small">Oscuro</span>
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
