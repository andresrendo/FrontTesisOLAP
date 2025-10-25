import React, { useEffect, useState } from 'react';
import { fetchDelayedAverage } from '../api';
import useQuerySql from '../hooks/useQuerySql';

function DelayedAverage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sqls = useQuerySql('delayedAverage'); // usa hook

  useEffect(() => {
    fetchDelayedAverage(2023)
      .then(res => setData(res))
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  const columnsEs = [
    'Aeropuerto de Llegada',
    'Mes',
    'Retraso Promedio (min)',
    'Ranking Retraso en el Mes'
  ];

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !Array.isArray(data[engine].result)) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;

    if (engine === 'monet') {
      rows = rows.map(arr => ({
        aeropuerto_llegada: arr[0],
        mes: arr[1],
        retraso_promedio: arr[2],
        ranking_retraso: arr[3]
      }));
    } else {
      rows = rows.map(obj => ({
        aeropuerto_llegada: obj.aeropuerto_llegada,
        mes: obj.mes,
        retraso_promedio: obj.retraso_promedio,
        ranking_retraso: obj.ranking_retraso
      }));
    }

    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className={`card-header ${engine === 'pg' ? 'bg-info' : 'bg-warning'} text-white text-center`}>
            <h4 className="mb-0">{label}</h4>
          </div>
          <div className="card-body">
            {/* wrapper con altura máxima y scroll vertical */}
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <table className="table table-bordered table-striped align-middle text-center mb-0">
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    {columnsEs.map(col => <th key={col}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.aeropuerto_llegada}</td>
                      <td>{row.mes}</td>
                      <td>{row.retraso_promedio !== null ? Number(row.retraso_promedio).toFixed(2) : 'Sin datos'}</td>
                      <td>{row.ranking_retraso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sqls && (
              <div className="mt-3">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  type="button"
                  onClick={() => {
                    const pre = document.getElementById(`sql-${engine}`);
                    if (pre) pre.style.display = pre.style.display === 'none' ? 'block' : 'none';
                  }}
                >
                  Mostrar SQL
                </button>
                <pre id={`sql-${engine}`} style={{ display: 'none', whiteSpace: 'pre-wrap', marginTop: 8, background:'#f8f9fa', padding:10 }}>
{engine === 'pg' ? sqls.pg : sqls.monet}
                </pre>
              </div>
            )}
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
            {renderTable('pg', 'PostgreSQL - Retraso Promedio por Aeropuerto y Mes')}
            {renderTable('monet', 'MonetDB - Retraso Promedio por Aeropuerto y Mes')}
          </>
        )}
      </div>
    </section>
  );
}

export default DelayedAverage;