import React, { useEffect, useState, useRef } from 'react';
import { fetchDbSizes } from '../api';

function formatBytes(bytes) {
  if (bytes === null || bytes === undefined) return 'N/A';
  const units = ['B','KB','MB','GB','TB'];
  let i = 0;
  let v = Number(bytes);
  if (isNaN(v)) return 'N/A';
  const sign = v < 0 ? '-' : '';
  v = Math.abs(v);
  while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
  return `${sign}${v.toFixed(2)} ${units[i]}`;
}

function DbSizesMonitor({ intervalMs = 0 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // acumuladores en memoria (se reinician al recargar la página)
  const [accum, setAccum] = useState({ monet: 0, pg: 0 });

  // prev en memoria (se reinicia con la recarga de la página)
  const prevRef = useRef({ monet: null, pg: null });

  // fetch que calcula delta en el frontend y actualiza acumuladores de la sesión
  async function fetchOnce() {
    try {
      setLoading(true);
      setError(null);
      const json = await fetchDbSizes(intervalMs);
      setData(json);

      // obtener bytes actuales
      const monetBytes = Number(json?.monet?.bytes ?? 0);
      const pgObj = Array.isArray(json?.postgres) ? json.postgres.find(p => p.datname === 'airline_pg') : null;
      const pgBytes = Number(pgObj?.bytes ?? 0);

      // calcular delta usando prevRef (si prev es null => delta = 0)
      const prevMonet = prevRef.current.monet;
      const prevPg = prevRef.current.pg;
      const monetDelta = (typeof prevMonet === 'number') ? (monetBytes - prevMonet) : 0;
      const pgDelta = (typeof prevPg === 'number') ? (pgBytes - prevPg) : 0;

      // guardar current como prev para la próxima actualización
      prevRef.current.monet = monetBytes;
      prevRef.current.pg = pgBytes;

      // actualizar acumulador de la sesión
      setAccum(prev => ({ monet: prev.monet + monetDelta, pg: prev.pg + pgDelta }));
    } catch (e) {
      setError(String(e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  // llamada inicial UNA sola vez para inicializar snapshot (devuelve delta=0 la primera vez)
  useEffect(() => {
    fetchOnce();
    // no polling automático
  }, [intervalMs]);

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
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-warning text-dark">MonetDB</div>
              <div className="card-body">
                <p className="mb-1"><strong>Path:</strong> {data.monet?.path}</p>
                <p className="mb-1"><strong>Tamaño:</strong> {formatBytes(data.monet?.bytes)} ({data.monet?.bytes ?? 0} bytes)</p>
                <p className="mb-0"><strong>Delta (acumulado):</strong> {formatBytes(accum.monet)} ({accum.monet} bytes)</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">PostgreSQL</div>
              <div className="card-body">
                {Array.isArray(data.postgres) ? (() => {
                  const pg = data.postgres.find(p => p.datname === 'airline_pg');
                  if (!pg) return <div className="text-muted">No se encontró la base <strong>airline_pg</strong></div>;
                  return (
                    <div>
                      <p className="mb-1"><strong>Path:</strong> /var/lib/postgresql/data</p>
                      <p className="mb-1"><strong>Tamaño:</strong> {formatBytes(pg.bytes)} ({pg.bytes ?? 0} bytes)</p>
                      <p className="mb-0"><strong>Delta (acumulado):</strong> {formatBytes(accum.pg)} ({accum.pg} bytes)</p>
                    </div>
                  );
                })() : <div className="text-muted">No hay datos de Postgres</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default DbSizesMonitor;