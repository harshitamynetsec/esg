import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/platform/PageHeader';
import { resourceApi } from '../../services/api';

export default function ObjectivesPage() {
  const api = useMemo(() => resourceApi('objectives'), []);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.list({ limit: 25 });
        setItems(response.data || []);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [api]);

  return (
    <section>
      <PageHeader title="Objectives" description="Track SMART ESG objectives and connect them to material topics and KPIs." />
      {error ? <p className="error-line">{error}</p> : null}
      <div className="metric-grid">
        {items.map((item) => (
          <div key={item._id || item.id} className="page-panel">
            <div className="page-header" style={{ marginBottom: 8 }}>
              <div><h3 style={{ margin: 0 }}>{item.title}</h3></div>
            </div>
            <p style={{ color: '#64748b' }}>{item.description || 'Objective aligned to the current ESG program.'}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <span>Status: {item.status || 'active'}</span>
              <span>Target: {item.targetDate ? new Date(item.targetDate).toLocaleDateString() : 'TBD'}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
                <div style={{ width: `${Math.min(100, Number(item.progress || 0))}%`, height: '100%', background: '#0f766e', borderRadius: 999 }} />
              </div>
              <div style={{ marginTop: 6, color: '#64748b' }}>{item.progress || 0}% complete</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
