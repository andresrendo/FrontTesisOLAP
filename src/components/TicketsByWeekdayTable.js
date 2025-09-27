import React, { useEffect, useState } from 'react';
import { fetchTicketsByWeekday } from '../api';

function TicketsByWeekdayTable() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTicketsByWeekday(2023)
      .then(res => setData(res))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const renderTable = (engine, label) => {
    if (!data || !data[engine] || !Array.isArray(data[engine].result)) return null;
    let rows = data[engine].result;
    if (rows.length === 0) return <div className="alert alert-warning text-center">No hay resultados para {label}</div>;
    let columns = ['Día', 'Tickets'];

    // MonetDB devuelve array de arrays, PostgreSQL array de objetos
    if (engine === 'monet') {
      rows = rows.map(arr => ({ weekday: arr[0], tickets: arr[1] }));
    }

    if (engine === 'pg') {
      rows = rows.map(obj => ({ weekday: obj.weekday, tickets: obj.tickets }));
    }

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
                  <th>Día</th>
                  <th>Tickets</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.weekday}</td>
                    <td>{row.tickets}</td>
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
          <>
            {renderTable('pg', 'PostgreSQL - Tickets por Día de la Semana')}
            {renderTable('monet', 'MonetDB - Tickets por Día de la Semana')}
          </>
        )}
      </div>
    </section>
  );
}

export default TicketsByWeekdayTable;