import React, { useEffect, useState } from 'react';
import { fetchDbSizes } from '../api';

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return 'N/A';
  const units = ['B','KB','MB','GB','TB'];
  let i = 0;
  let v = Number(bytes);
  if (isNaN(v)) return 'N/A';
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(2)} ${units[i]}`;
}

function DbSizesMonitor({ intervalMs = 0, pollMs = 0 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchOnce() {
    try {
      setLoading(true);
      setError(null);
      const json = await fetchDbSizes(intervalMs);
      setData(json);
    } catch (e) {
      setError(String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOnce();
    if (pollMs > 0) {
      const t = setInterval(fetchOnce, pollMs);
      return () => clearInterval(t);
    }
  }, [intervalMs, pollMs]);

  return (
    <section className="container my-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Monitor DB: tamaños</h5>
        <div>
          <button className="btn btn-sm btn-outline-primary me-2" onClick={fetchOnce}>Actualizar</button>
          <small className="text-muted">intervalMs: {intervalMs}ms</small>
        </div>
      </div>

      {loading && <div className="alert alert-info">Obteniendo métricas...</div>}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      {data && (
        <div className="row g-3">
          {/* MonetDB card */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">MonetDB</div>
              <div className="card-body">
                <p className="mb-1"><strong>Path:</strong> {data.monet?.path}</p>
                <p className="mb-1"><strong>Tamaño:</strong> {formatBytes(data.monet?.bytes)} ({data.monet?.bytes ?? 0} bytes)</p>
                <p className="mb-0"><strong>Delta:</strong> {formatBytes(data.monet?.deltaBytes)} ({data.monet?.deltaBytes ?? 0} bytes)</p>
              </div>
            </div>
          </div>

          {/* Postgres: sólo airline_pg mostrado igual que Monet */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">PostgreSQL</div>
              <div className="card-body">
                {Array.isArray(data.postgres) ? (
                  (() => {
                    const pg = data.postgres.find(p => p.datname === 'airline_pg');
                    if (!pg) return <div className="text-muted">No se encontró la base <strong>airline_pg</strong></div>;
                    return (
                      <div>
                        <p className="mb-1"><strong>Path:</strong> /var/lib/postgresql/data</p>
                        <p className="mb-1"><strong>Tamaño:</strong> {formatBytes(pg.bytes)} ({pg.bytes ?? 0} bytes)</p>
                        <p className="mb-0"><strong>Delta:</strong> {formatBytes(pg.deltaBytes)} ({pg.deltaBytes ?? 0} bytes)</p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-muted">No hay datos de Postgres</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DbSizesMonitor;