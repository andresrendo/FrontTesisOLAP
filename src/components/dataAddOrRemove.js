import React, { useState } from 'react';
import { addFlightsRow, removeFlightsRow, addFlightsBatch, removeFlightsBatch } from '../api';

export default function FlightActions() {
  const [count, setCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const run = async (fn, label) => {
    setLoading(true);
    setMessage('');
    const t0 = performance.now();
    try {
      const r = await fn(count);
      const t1 = performance.now();
      const durationMs = Math.round(t1 - t0);
      const n = (r.inserted && r.inserted.length) || (r.deleted && r.deleted.length) || 0;
      setMessage(`${label} ✓ (${n}) — ${durationMs} ms`);
    } catch (e) {
      setMessage(`${label} Error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container text-center my-4">
      <h3>Acciones de Vuelos</h3>
      <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
        <input
          type="number"
          className="form-control"
          style={{ width: 100 }}
          value={count}
          min={1}
          onChange={e => setCount(Number(e.target.value || 0))}
        />
      </div>

      <div className="d-flex justify-content-center gap-2 mb-2 flex-wrap">
        <button className="btn btn-outline-primary" disabled={loading} onClick={() => run(addFlightsRow, 'Insert (row)')}>
          Agregar (fila a fila)
        </button>
        <button className="btn btn-outline-danger" disabled={loading} onClick={() => run(removeFlightsRow, 'Eliminar (row)')}>
          Eliminar (fila a fila)
        </button>

        <button className="btn btn-primary" disabled={loading} onClick={() => run(addFlightsBatch, 'Insert (batch)')}>
          Agregar (batch)
        </button>
        <button className="btn btn-warning" disabled={loading} onClick={() => run(removeFlightsBatch, 'Eliminar (batch)')}>
          Eliminar (batch)
        </button>
      </div>

      {message && <div className="mt-3"><div className="alert alert-info">{message}</div></div>}
    </div>
  );
}