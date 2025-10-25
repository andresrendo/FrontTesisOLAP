import { useEffect, useState } from 'react';
import { fetchQuerySql } from '../api';

function extractSqlField(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    // busca la primera propiedad string no vacía
    for (const k of Object.keys(val)) {
      if (typeof val[k] === 'string' && val[k].trim().length > 0) return val[k];
    }
    // casos comunes
    if (typeof val.sql === 'string' && val.sql.trim().length > 0) return val.sql;
    if (typeof val.query === 'string' && val.query.trim().length > 0) return val.query;
    // fallback: stringify (útil para depuración)
    try { return JSON.stringify(val, null, 2); } catch (e) { return String(val); }
  }
  return String(val);
}

export default function useQuerySql(name, opts = {}) {
  const [sqls, setSqls] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!name) {
      setSqls(null);
      return;
    }

    setSqls(null);
    console.log('useQuerySql: fetching', name, opts);

    fetchQuerySql(name, opts)
      .then(r => {
        console.log('useQuerySql: fetchQuerySql response', name, r);
        if (!mounted) return;
        if (r && r.ok) {
          const pg = extractSqlField(r.pg);
          const monet = extractSqlField(r.monet);
          console.log('useQuerySql: extracted', { pgPreview: pg.slice(0, 200), monetPreview: monet.slice(0, 200) });
          setSqls({ pg, monet });
        } else {
          setSqls(null);
        }
      })
      .catch(err => {
        console.error('useQuerySql error', name, err);
        if (mounted) setSqls(null);
      });

    return () => { mounted = false; };
  }, [name, JSON.stringify(opts)]);

  return sqls;
}