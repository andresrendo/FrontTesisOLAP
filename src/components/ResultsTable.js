import React, { useEffect, useState } from 'react';
import { fetchRevenueByCountry } from '../api';

function ResultsTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRevenueByCountry()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Helper para extraer métricas
  const getMetrics = (engine) => {
    if (!data || !data[engine] || !data[engine].metrics) return {};
    const m = data[engine].metrics;
    // Notación científica para delta CPU
    const cpuDelta = m.cpu?.delta?.user ?? 0;
    return {
      duration: m.durationMs?.toFixed(2) ?? '-',
      cpu: cpuDelta === 0 ? '0' : cpuDelta.toExponential(2),
      memory: (m.memory?.delta?.used ? (m.memory.delta.used / 1024 / 1024).toFixed(2) : '-')
    };
  };

  return (
    <section className="container my-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h2 className="mb-0">Resultados Detallados</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">Error: {error}</div>
          ) : !data ? (
            <div className="alert alert-warning text-center">No hay datos</div>
          ) : (
            <table className="table table-striped table-bordered align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>Motor</th>
                  <th>Tiempo (ms)</th>
                  <th>CPU (%)</th>
                  <th>Memoria (MB)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PostgreSQL</td>
                  <td>{getMetrics('pg').duration}</td>
                  <td>{getMetrics('pg').cpu}</td>
                  <td>{getMetrics('pg').memory}</td>
                </tr>
                <tr>
                  <td>MonetDB</td>
                  <td>{getMetrics('monet').duration}</td>
                  <td>{getMetrics('monet').cpu}</td>
                  <td>{getMetrics('monet').memory}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResultsTable;
