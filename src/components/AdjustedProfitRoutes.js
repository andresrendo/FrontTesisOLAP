import React, { useEffect, useState } from 'react';
import { fetchAdjustedProfitRoutes } from '../api';

function AdjustedProfitRoutes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdjustedProfitRoutes(2023, 20)
      .then(res => setData(res))
      .catch(err => setError(err.message))
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
    }

    return (
        <div
        className="mb-4"
        style={{
            minWidth: 700,
            maxWidth: 800,
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
                    <td>{row.total_flights}</td>
                    <td>{Number(row.total_revenue).toFixed(2)}</td>
                    <td>{Number(row.avg_delay_min).toFixed(2)}</td>
                    <td>{Number(row.avg_seat_capacity).toFixed(2)}</td>
                    <td>{Number(row.avg_occupancy_rate * 100).toFixed(2)}%</td>
                    <td>{Number(row.adjusted_profit).toFixed(2)}</td>
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