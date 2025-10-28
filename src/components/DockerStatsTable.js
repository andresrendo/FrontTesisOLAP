import React, { useEffect, useState } from 'react';
import { fetchDockerStats, fetchMonitor } from '../api';

const POLL_MS = 1000; // intervalo de polling en ms

function DockerStatsTable() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [speeds, setSpeeds] = useState({ pg: null, monet: null });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let mounted = true;
    let timer = null;

    async function fetchAll() {
      try {
        const [dsRes, pgRes, monetRes] = await Promise.all([
          fetchDockerStats().catch(e => { throw { source: 'docker', e }; }),
          fetchMonitor('pg').catch(e => { throw { source: 'pg', e }; }),
          fetchMonitor('monet').catch(e => { throw { source: 'monet', e }; })
        ]);

        if (!mounted) return;

        setStats(dsRes && dsRes.stats ? dsRes.stats : null);
        setSpeeds({
          pg: (pgRes && typeof pgRes.durationMs === 'number') ? pgRes.durationMs : null,
          monet: (monetRes && typeof monetRes.durationMs === 'number') ? monetRes.durationMs : null
        });
        setError(null);
        setLoading(false);
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        if (!mounted) return;
        setLoading(false);
        const src = err && err.source ? err.source : 'unknown';
        const msg = err && err.e ? (err.e.message || String(err.e)) : (err && err.message ? err.message : String(err));
        setError(`Error (${src}): ${msg}`);
      }
    }

    // first immediate fetch
    fetchAll();

    // polling
    timer = setInterval(() => {
      fetchAll();
    }, POLL_MS);

    return () => {
      mounted = false;
      if (timer) clearInterval(timer);
    };
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
            <>
              <div className="d-flex justify-content-between mb-2">
                <small className="text-muted">Última actualización: {lastUpdated || '-'}</small>
                <small className="text-muted">Polling cada {POLL_MS / 1000}s</small>
              </div>
              <table className="table table-striped table-bordered align-middle text-center">
                <thead className="table-success">
                  <tr>
                    <th>Contenedor</th>
                    <th>CPU (%)</th>
                    <th>Memoria</th>
                    <th>Net I/O</th>
                    <th>Velocidad (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats).map(([name, val]) => {
                    // map container name to db key and friendly label
                    const dbKey = name.toLowerCase().includes('postgres') ? 'pg' : name.toLowerCase().includes('monetdb') ? 'monet' : null;
                    const displayName = dbKey === 'pg' ? 'PostgreSQL' : dbKey === 'monet' ? 'MonetDB' : name;
                    return (
                      <tr key={name}>
                        <td style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 600 }}>{displayName}</div>
                          {displayName !== name && <small className="text-muted">{name}</small>}
                        </td>
                        <td>{val.cpu}</td>
                        <td>{val.mem}</td>
                        <td>{val.netio || '-'}</td>
                        <td>{dbKey && speeds[dbKey] != null ? speeds[dbKey].toFixed(2) : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default DockerStatsTable;
