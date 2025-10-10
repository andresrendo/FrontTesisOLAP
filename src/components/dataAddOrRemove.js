import React, { useState } from 'react';
import { addFlights, removeFlights } from '../api';

export default function FlightActions() {
  const [count, setCount] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAdd = async () => {
    if (!Number.isFinite(count) || count < 1) {
      setMessage('Ingrese un número válido (>= 1).');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await addFlights(count);
      setResult(res);
      if (res && res.ok && Array.isArray(res.inserted) && res.inserted.length > 0) {
        setMessage(`✅ Se añadieron ${res.inserted.length} vuelos correctamente.`);
      } else if (res && res.ok) {
        setMessage('No se añadieron vuelos nuevos.');
      } else {
        setMessage('❌ Error al añadir vuelos.' + (res && res.error ? ` (${res.error})` : ''));
      }
    } catch (e) {
      setMessage('❌ Error al añadir vuelos.');
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    if (!Number.isFinite(count) || count < 1) {
      setMessage('Ingrese un número válido (>= 1).');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await removeFlights(count);
      setResult(res);
      if (res && res.ok && Array.isArray(res.deleted) && res.deleted.length > 0) {
        setMessage(`🗑️ Se eliminaron ${res.deleted.length} vuelos correctamente.`);
        if (res.message) setMessage(prev => prev + ' ' + res.message);
      } else if (res && res.ok && Array.isArray(res.deleted) && res.deleted.length === 0) {
        setMessage('No hay más vuelos generados para borrar.');
      } else {
        setMessage('❌ Error al eliminar vuelos.' + (res && res.error ? ` (${res.error})` : ''));
      }
    } catch (e) {
      setMessage('❌ Error al eliminar vuelos.');
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 40
    }}>
      <h3 style={{ marginBottom: 16 }}>Acciones de Vuelos</h3>
      <div style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        marginBottom: 16
      }}>
        <input
          type="number"
          value={count}
          min={1}
          onChange={e => setCount(Number(e.target.value))}
          style={{
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 16,
            width: 80
          }}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Agregar vuelos
        </button>
        <button
          onClick={handleRemove}
          disabled={loading}
          style={{
            padding: '8px 18px',
            borderRadius: 6,
            border: 'none',
            background: '#d32f2f',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Eliminar vuelos
        </button>
      </div>
      {loading && <p style={{ color: '#1976d2' }}>Cargando...</p>}
      {message && (
        <div style={{
          background: '#e3f2fd',
          color: '#1976d2',
          padding: 10,
          borderRadius: 6,
          marginTop: 8,
          fontWeight: 'bold',
          maxWidth: 400,
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}