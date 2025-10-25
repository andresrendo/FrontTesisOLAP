import React, { useEffect, useState } from 'react';
import { fetchTopRoutes } from '../api';
import useQuerySql from '../hooks/useQuerySql';

function TopRoutesTables() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPg, setShowPg] = useState(false);
  const [showMonet, setShowMonet] = useState(false);
  const sqls = useQuerySql('topRoutes');

  // debug: muestra en consola cuándo cambia lo que trae useQuerySql
  useEffect(() => {
    console.log('useQuerySql(topRoutes) ->', sqls);
  }, [sqls]);

  useEffect(() => {
    fetchTopRoutes({ year: 2023 })
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        setError(err.message || String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columnsEs = ['Origen', 'Destino', 'Tickets', 'Revenue (USD)'];

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !Array.isArray(data[engine].result)) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;

    if (engine === 'monet') {
      rows = rows.map((arr) => ({
        origen: arr[0],
        destino: arr[1],
        tickets: arr[2],
        revenue: arr[3]
      }));
    } else {
      rows = rows.map((obj) => ({
        origen: obj.origin_airport || obj.origen || obj.origin,
        destino: obj.destination_airport || obj.destino || obj.destination,
        tickets: obj.tickets,
        revenue: obj.revenue
      }));
    }

    const isShown = engine === 'pg' ? showPg : showMonet;
    const toggle = () => (engine === 'pg' ? setShowPg((s) => !s) : setShowMonet((s) => !s));

    // si sqls es objeto vacío o distinto, lo mostramos serializado para depurar
    const sqlText = sqls
      ? (engine === 'pg' ? (typeof sqls.pg === 'string' ? sqls.pg : JSON.stringify(sqls.pg, null, 2))
                         : (typeof sqls.monet === 'string' ? sqls.monet : JSON.stringify(sqls.monet, null, 2)))
      : '';

    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow h-100">
          <div className={`card-header ${engine === 'pg' ? 'bg-info' : 'bg-warning'} text-white text-center`}>
            <h4 className="mb-0">{label}</h4>
          </div>
          <div className="card-body p-0">
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <table className="table table-bordered table-striped align-middle text-center mb-0">
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>{columnsEs.map((col) => <th key={col}>{col}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.origen}</td>
                      <td>{row.destino}</td>
                      <td>{row.tickets}</td>
                      <td>{row.revenue != null ? Number(row.revenue).toFixed(2) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={toggle}>
                {isShown ? 'Ocultar SQL' : 'Mostrar SQL'}
              </button>

              <div style={{ display: isShown ? 'block' : 'none', marginTop: 10 }}>
                <div style={{ background: '#f8f9fa', padding: 12, border: '1px solid #e9ecef', borderRadius: 4 }}>
                  {sqlText ? (
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontSize: 13 }}>{sqlText}</pre>
                  ) : (
                    <div className="text-muted" style={{ fontSize: 13 }}>
                      SQL no disponible — revisa Network (GET /api/olap/query-sql?name=topRoutes) o la consola.
                      <div style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 12, color: '#333' }}>
                        Debug raw sqls: {sqls ? <pre style={{ margin: 0 }}>{JSON.stringify(sqls, null, 2)}</pre> : 'null'}
                      </div>
                    </div>
                  )}
                </div>
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