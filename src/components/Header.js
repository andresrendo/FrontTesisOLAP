import React from 'react';

function Header() {
  return (
    <header className="container position-relative">
      {/* logo fijo en la esquina superior izquierda (fuera del rectángulo azul) */}
      <img
        src="/logo.png"
        alt="Universidad Metropolitana"
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          width: 160,
          height: 'auto',
          zIndex: 1050,
          objectFit: 'contain'
        }}
      />

      <div className="bg-primary text-white text-center py-4 rounded shadow-sm mb-4 position-relative overflow-hidden">
        <h1 className="display-5 fw-bold mb-1">Estudio Comparativo: PostgreSQL vs MonetDB</h1>
        <p className="lead mb-0" style={{ maxWidth: 960, margin: '0 auto' }}>
          Visualización de resultados de pruebas analíticas en un almacén de datos dimensional
        </p>
      </div>
    </header>
  );
}

export default Header;
