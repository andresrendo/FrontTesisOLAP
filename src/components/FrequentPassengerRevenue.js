import React, { useEffect, useState } from 'react';
import { fetchFrequentPassengerRevenue } from '../api';
import useQuerySql from '../hooks/useQuerySql';

const columns = [
  'Aeropuerto Origen',
  'Aeropuerto Destino',
  'Mes',
  'Ingresos Totales (USD)',
  'Ingresos Pasajeros Frecuentes (USD)',
  'Porcentaje Ingresos Frecuentes (%)'
];

function FrequentPassengerRevenue({ year = 2023, limit = 20 }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // SQL toggle states (igual que AdjustedProfitRoutes)
  const [showSqlPg, setShowSqlPg] = useState(false);
  const [showSqlMonet, setShowSqlMonet] = useState(false);

  const sqls = useQuerySql('frequentPassengerRevenue', { year, limit });

  useEffect(() => {
    setLoading(true);
    fetchFrequentPassengerRevenue(year, limit)
      .then(setData)
      .catch(e => setError(e.message || String(e)))
      .finally(() => setLoading(false));
  }, [year, limit]);

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !data[engine].result) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;

    // MonetDB: array de arrays, PostgreSQL: array de objetos
    if (engine === 'monet') {
      rows = rows.map(arr => ({
        departure_airport: arr[0],
        arrival_airport: arr[1],
        month: arr[2],
        total_revenue: arr[3],
        frequent_revenue: arr[4],
        frequent_revenue_pct: arr[5]
      }));
    }

    const sqlText = sqls ? (engine === 'pg' ? sqls.pg : sqls.monet) : '';

    const isShown = engine === 'pg' ? showSqlPg : showSqlMonet;
    const toggle = () => (engine === 'pg' ? setShowSqlPg(s => !s) : setShowSqlMonet(s => !s));

    return (
      <div
        className="mb-4"
        style={{
          minWidth: 700,
          maxWidth: 900,
          height: 600,
          overflow: 'auto',
          flex: '0 0 auto'
        }}
      >
        <div className="card shadow h-100">
          <div className={`card-header ${engine === 'pg' ? 'bg-info' : 'bg-warning'} text-white text-center`}>
            <h4 className="mb-0">{label}</h4>
          </div>
          <div className="card-body p-0">
            <table className="table table-bordered table-striped align-middle text-center mb-0">
              <thead className="table-light">
                <tr>
                  {columns.map(col => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.departure_airport}</td>
                    <td>{row.arrival_airport}</td>
                    <td>{row.month}</td>
                    <td>{row.total_revenue != null ? Number(row.total_revenue).toFixed(2) : '—'}</td>
                    <td>{row.frequent_revenue != null ? Number(row.frequent_revenue).toFixed(2) : '—'}</td>
                    <td>{row.frequent_revenue_pct != null ? Number(row.frequent_revenue_pct).toFixed(2) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={toggle}
              >
                {isShown ? 'Ocultar SQL' : 'Mostrar SQL'}
              </button>
              <div style={{ display: isShown ? 'block' : 'none', marginTop: 10, background: '#f8f9fa', padding: 12, border: '1px solid #e9ecef', borderRadius: 4 }}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 13 }}>{sqlText || 'SQL no disponible'}</pre>
              </div>
            </div>

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
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'nowrap', justifyContent: 'center' }}>
            {renderTable('pg', 'PostgreSQL')}
            {renderTable('monet', 'MonetDB')}
          </div>
        )}
      </div>
    </section>
  );
}

export default FrequentPassengerRevenue;