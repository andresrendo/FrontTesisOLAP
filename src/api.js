export async function fetchDockerStats() {
  const res = await fetch(`${API_BASE}/monitor/docker-stats`);
  if (!res.ok) throw new Error('Error al obtener docker stats');
  return await res.json();
}
// src/api.js

const API_BASE = 'http://localhost:3000/api';

export async function fetchQuerySql(name, opts = {}) {
  const qs = new URLSearchParams({
    name,
    ...(opts.year ? { year: opts.year } : {}),
    ...(opts.limit ? { limit: opts.limit } : {})
  });
  const res = await fetch(`${API_BASE}/olap/query-sql?${qs.toString()}`);
  const text = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`fetchQuerySql failed: ${res.status} ${text}`);
  }
  // intenta parsear JSON (el backend devuelve JSON)
  try {
    return JSON.parse(text);
  } catch (e) {
    // si no es JSON, devolver raw string en estructura consistente
    return { ok: true, name, pg: text, monet: text };
  }
}

export async function fetchRevenueByCountry(year = 2023) {
  const res = await fetch(`${API_BASE}/olap/revenue-by-country?year=${year}`);
  if (!res.ok) throw new Error('Error al obtener revenue-by-country');
  return await res.json();
}

export async function fetchTopRoutes() {
  const res = await fetch(`${API_BASE}/olap/top-routes`);
  if (!res.ok) throw new Error('Error al obtener top-routes');
  return await res.json();
}

export async function fetchMonitor(db) {
  const res = await fetch(`${API_BASE}/monitor/${db}`);
  if (!res.ok) throw new Error('Error al obtener monitor');
  return await res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Error al obtener health');
  return await res.json();
}

export async function fetchHealthPg() {
  const res = await fetch(`${API_BASE}/health/pg`);
  if (!res.ok) throw new Error('Error al obtener health pg');
  return await res.json();
}

export async function fetchHealthMonet() {
  const res = await fetch(`${API_BASE}/health/monet`);
  if (!res.ok) throw new Error('Error al obtener health monet');
  return await res.json();
}

export async function fetchTicketsByWeekday(year = 2023) {
  const res = await fetch(`${API_BASE}/olap/tickets-by-weekday?year=${year}`);
  if (!res.ok) throw new Error('Error al obtener tickets-by-weekday');
  return await res.json();
}

export async function fetchLeastTravelledNationality(year = 2023, limit = 1) {
  const res = await fetch(`${API_BASE}/olap/least-travelled-nationality?year=${year}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener least-travelled-nationality');
  return await res.json();
}

export async function fetchRevenueBySeatClassAndMonth(year = 2023) {
  const res = await fetch(`${API_BASE}/olap/revenue-by-seatclass-month?year=${year}`);
  if (!res.ok) throw new Error('Error al obtener revenue-by-seatclass-month');
  return await res.json();
}


export async function fetchDelayedAverage(year = 2023) {
  const res = await fetch(`${API_BASE}/olap/delayed-average?year=${year}`);
  if (!res.ok) throw new Error('Error al obtener delayed-average');
  return await res.json();
}

export async function fetchPassengersByAircraft(year = 2023) {
  const res = await fetch(`${API_BASE}/olap/passengers-by-aircraft?year=${year}`);
  if (!res.ok) throw new Error('Error al obtener passengers-by-aircraft');
  return await res.json();
}

export async function fetchAdjustedProfitRoutes(year = 2023, limit = 20) {
  const res = await fetch(`${API_BASE}/olap/adjusted-profit-routes?year=${year}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener adjusted-profit-routes');
  return await res.json();
}


export async function fetchFrequentPassengerRevenue(year = 2023, limit = 20) {
  const res = await fetch(`${API_BASE}/olap/frequent-passenger-revenue?year=${year}&limit=${limit}`);
  if (!res.ok) throw new Error('Error al obtener frequent-passenger-revenue');
  return await res.json();
}

export async function addFlights(count = 100) {
  const res = await fetch(`${API_BASE}/olap/add-flights-new?count=${count}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al agregar vuelos');
  return await res.json();
}

export async function removeFlights(count = 100) {
  const res = await fetch(`${API_BASE}/olap/remove-flights-new?count=${count}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al eliminar vuelos');
  return await res.json();
}

// Legacy / row-by-row (mantener compatibilidad)
export async function addFlightsRow(count = 100) {
  const res = await fetch(`${API_BASE}/olap/add-flights-row?count=${count}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al agregar vuelos (row)');
  return await res.json();
}
export async function removeFlightsRow(count = 100) {
  const res = await fetch(`${API_BASE}/olap/remove-flights-row?count=${count}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al eliminar vuelos (row)');
  return await res.json();
}

// Batch endpoints
export async function addFlightsBatch(count = 100) {
  const res = await fetch(`${API_BASE}/olap/add-flights-batch?count=${count}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al agregar vuelos (batch)');
  return await res.json();
}
export async function removeFlightsBatch(count = 100) {
  const res = await fetch(`${API_BASE}/olap/remove-flights-batch?count=${count}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al eliminar vuelos (batch)');
  return await res.json();
}

// Opcional: mantener alias viejo por compatibilidad (renombrados para evitar colisión)
export const addFlightsLegacy = addFlightsRow;
export const removeFlightsLegacy = removeFlightsRow;