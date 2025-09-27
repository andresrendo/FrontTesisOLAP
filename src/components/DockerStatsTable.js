import React, { useEffect, useState } from 'react';
import { fetchDockerStats, fetchMonitor } from '../api';

function DockerStatsTable() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speeds, setSpeeds] = useState({ pg: null, monet: null });

  useEffect(() => {
    // Fetch Docker stats
    fetchDockerStats()
      .then((res) => {
        setStats(res.stats);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // Fetch query speeds for each DB
    fetchMonitor('pg').then((res) => {
      setSpeeds((prev) => ({ ...prev, pg: res.durationMs }));
    });
    fetchMonitor('monet').then((res) => {
      setSpeeds((prev) => ({ ...prev, monet: res.durationMs }));
    });
  }, []);

  return (
    <section className="container my-4">
      <div className="card shadow-lg">
        <div className="card-header bg-success text-white text-center">
          <h2 className="mb-0">Recursos Docker en Tiempo Real</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">Error: {error}</div>
          ) : !stats ? (
            <div className="alert alert-warning text-center">No hay datos</div>
          ) : (
            <table className="table table-striped table-bordered align-middle text-center">
              <thead className="table-success">
                <tr>
                  <th>Contenedor</th>
                  <th>CPU (%)</th>
                  <th>Memoria</th>
                  <th>Velocidad (ms)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats).map(([name, val]) => {
                  // Map container name to DB key
                  let dbKey = name.includes('postgres') ? 'pg' : name.includes('monetdb') ? 'monet' : null;
                  return (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{val.cpu}</td>
                      <td>{val.mem}</td>
                      <td>{dbKey && speeds[dbKey] ? speeds[dbKey].toFixed(2) : '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default DockerStatsTable;
