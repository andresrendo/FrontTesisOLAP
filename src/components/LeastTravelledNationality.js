import React, { useEffect, useState } from 'react';
import { fetchLeastTravelledNationality } from '../api';
import useQuerySql from '../hooks/useQuerySql';

function LeastTravelledNationalityTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // SQL toggle states (Postgres / Monet)
  const [showSqlPg, setShowSqlPg] = useState(false);
  const [showSqlMonet, setShowSqlMonet] = useState(false);

  const year = 2023;
  const limit = 5;

  // request SQL for this query (uses same params que fetch)
  const sqls = useQuerySql('leastTravelledNationality', { year, limit });

  useEffect(() => {
    fetchLeastTravelledNationality(year, limit)
      .then(res => setData(res))
      .catch(err => setError(err.message || String(err)))
      .finally(() => setLoading(false));
  }, []);

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !Array.isArray(data[engine].result)) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;
    const columns = ['Nacionalidad', 'Total de Viajes'];

    // MonetDB devuelve array de arrays, PostgreSQL array de objetos
    if (engine === 'monet') {
      rows = rows.map(arr => ({ nationality: arr[0], total_viajes: arr[1] }));
    } else {
      rows = rows.map(obj => ({ nationality: obj.nationality, total_viajes: obj.total_viajes }));
    }

    const sqlText = sqls ? (engine === 'pg' ? sqls.pg : sqls.monet) : '';
    const isShown = engine === 'pg' ? showSqlPg : showSqlMonet;
    const toggle = () => (engine === 'pg' ? setShowSqlPg(s => !s) : setShowSqlMonet(s => !s));

    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className={`card-header ${engine === 'pg' ? 'bg-info' : 'bg-warning'} text-white text-center`}>
            <h4 className="mb-0">{label}</h4>
          </div>
          <div className="card-body">
            <table className="table table-bordered table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  {columns.map(col => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.nationality}</td>
                    <td>{row.total_viajes}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-2">
              <button className="btn btn-sm btn-outline-secondary" type="button" onClick={toggle}>
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
          <>
            {renderTable('pg', 'PostgreSQL - Nacionalidades con Menos Viajes')}
            {renderTable('monet', 'MonetDB - Nacionalidades con Menos Viajes')}
          </>
        )}
      </div>
    </section>
  );
}

export default LeastTravelledNationalityTable;