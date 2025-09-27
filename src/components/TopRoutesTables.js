import React, { useEffect, useState } from 'react';
import { fetchTopRoutes } from '../api';

function TopRoutesTables() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopRoutes({ year: 2023 })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Nombres de columnas en español
  const columnsEs = [
    'Origen',
    'Destino',
    'Tickets',
    'Revenue (USD)'
  ];

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !Array.isArray(data[engine].result)) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;

    // MonetDB: array de arrays, PostgreSQL: array de objetos
    if (engine === 'monet') {
      rows = rows.map(arr => ({
        origen: arr[0],
        destino: arr[1],
        tickets: arr[2],
        revenue: arr[3]
      }));
    } else {
      rows = rows.map(obj => ({
        origen: obj.origin_airport,
        destino: obj.destination_airport,
        tickets: obj.tickets,
        revenue: obj.revenue
      }));
    }

    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className={`card-header ${engine === 'pg' ? 'bg-info' : 'bg-warning'} text-white text-center`}>
            <h4 className="mb-0">{label}</h4>
          </div>
          <div className="card-body">
            <table className="table table-bordered table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  {columnsEs.map(col => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.origen}</td>
                    <td>{row.destino}</td>
                    <td>{row.tickets}</td>
                    <td>{row.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="container my-4">
      <div className="row">
        {loading ? (
          <div className="col-12 text-center py-4">
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando...</p>
          </div>
        ) : error ? (
          <div className="col-12 alert alert-danger text-center">Error: {error}</div>
        ) : !data ? (
          <div className="col-12 alert alert-warning text-center">No hay datos</div>
        ) : (
          <>
            {renderTable('pg', 'PostgreSQL - Rutas Top')}
            {renderTable('monet', 'MonetDB - Rutas Top')}
          </>
        )}
      </div>
    </section>
  );
}

export default TopRoutesTables;