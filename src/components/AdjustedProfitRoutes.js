import React, { useEffect, useState } from 'react';
import { fetchAdjustedProfitRoutes } from '../api';
import useQuerySql from '../hooks/useQuerySql';

function AdjustedProfitRoutes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // added: local UI state to toggle SQL visibility (React-controlled, no bootstrap JS)
  const [showSqlPg, setShowSqlPg] = useState(false);
  const [showSqlMonet, setShowSqlMonet] = useState(false);

  useEffect(() => {
    fetchAdjustedProfitRoutes(2023, 20)
      .then(res => setData(res))
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    'Aeropuerto Origen',
    'Aeropuerto Destino',
    'Vuelos Totales',
    'Ingresos Totales (USD)',
    'Retraso Promedio (min)',
    'Capacidad Promedio',
    'Ocupación Promedio',
    'Rentabilidad Ajustada (USD)'
  ];

  const sqls = useQuerySql('adjustedProfitRoutes'); // { pg, monet }

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !data[engine].result) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;

    if (engine === 'monet') {
      rows = rows.map(arr => ({
        departure_airport: arr[0],
        arrival_airport: arr[1],
        total_flights: arr[2],
        total_revenue: arr[3],
        avg_delay_min: arr[4],
        avg_seat_capacity: arr[5],
        avg_occupancy_rate: arr[6],
        adjusted_profit: arr[7]
      }));
    } else {
      rows = rows.map(obj => ({
        departure_airport: obj.departure_airport || obj.origin_airport || obj.origin,
        arrival_airport: obj.arrival_airport || obj.destination_airport || obj.destination,
        total_flights: obj.total_flights,
        total_revenue: obj.total_revenue,
        avg_delay_min: obj.avg_delay_min,
        avg_seat_capacity: obj.avg_seat_capacity,
        avg_occupancy_rate: obj.avg_occupancy_rate,
        adjusted_profit: obj.adjusted_profit
      }));
    }

    const sqlText = sqls ? (engine === 'pg' ? sqls.pg : sqls.monet) : '';

    // determine visibility + toggle function for this engine
    const isShown = engine === 'pg' ? showSqlPg : showSqlMonet;
    const toggle = () => engine === 'pg' ? setShowSqlPg(s => !s) : setShowSqlMonet(s => !s);

    return (
      <div className="mb-4" style={{ minWidth: 700, maxWidth: 900, flex: '0 0 auto' }}>
        <div className="card shadow h-100">
          <div className={`card-header ${engine === 'pg' ? 'bg-info' : 'bg-warning'} text-white text-center`}>
            <h4 className="mb-0">{label}</h4>
          </div>
          <div className="card-body p-0">
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <table className="table table-bordered table-striped align-middle text-center mb-0">
                <thead className="table-light" style={{ position:'sticky', top:0, zIndex:1 }}>
                  <tr>{columns.map(col => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.departure_airport}</td>
                      <td>{row.arrival_airport}</td>
                      <td>{row.total_flights}</td>
                      <td>{row.total_revenue != null ? Number(row.total_revenue).toFixed(2) : '—'}</td>
                      <td>{row.avg_delay_min != null ? Number(row.avg_delay_min).toFixed(2) : '—'}</td>
                      <td>{row.avg_seat_capacity != null ? Number(row.avg_seat_capacity).toFixed(2) : '—'}</td>
                      <td>{row.avg_occupancy_rate != null ? `${(Number(row.avg_occupancy_rate) * 100).toFixed(2)}%` : '—'}</td>
                      <td>{row.adjusted_profit != null ? Number(row.adjusted_profit).toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* React toggle button + styled SQL block (looks like previous screenshot) */}
            <div className="p-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={toggle}
              >
                {isShown ? 'Ocultar SQL' : 'Mostrar SQL'}
              </button>
              <div style={{ display: isShown ? 'block' : 'none', marginTop: 10, background: '#f8f9fa', padding: 12, border: '1px solid #e9ecef', borderRadius: 4 }}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 13 }}>{sqlText}</pre>
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
            <div className="spinner-border text-info" role="status"><span className="visually-hidden">Cargando...</span></div>
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

export default AdjustedProfitRoutes;