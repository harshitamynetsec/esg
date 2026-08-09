import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Search } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { resourceApi } from '../../services/api';

export default function GoalsKPIsPage() {
  const api = useMemo(() => resourceApi('kpis'), []);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.list({ limit: 25 });
        setItems(response.data || []);
        setSelected(response.data?.[0] || null);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [api]);

  const visibleItems = useMemo(() => {
    const query = search.toLowerCase();
    return items.filter((item) => [item.name, item.pillar, item.unit].some((value) => (value || '').toLowerCase().includes(query)));
  }, [items, search]);

  useEffect(() => {
    if (!selected && visibleItems[0]) setSelected(visibleItems[0]);
  }, [selected, visibleItems]);

  const selectedTrend = useMemo(() => {
    const base = Number(selected?.currentValue || 0);
    const target = Number(selected?.targetValue || 0);
    return [
      { month: 'Jan', value: Math.max(0, base - 10) },
      { month: 'Feb', value: Math.max(0, base - 5) },
      { month: 'Mar', value: base },
      { month: 'Apr', value: Math.min(target || base, base + 5) },
      { month: 'May', value: Math.min(target || base, base + 10) },
    ];
  }, [selected]);

  return (
    <section>
      <PageHeader title="KPI Management" description="Review KPI performance, trends, and targets across the organization." />
      {error ? <p className="error-line">{error}</p> : null}
      <div className="page-panel" style={{ marginBottom: 16 }}>
        <div className="field" style={{ maxWidth: 320 }}>
          <span>Search KPIs</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or pillar" />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="page-panel">
          <div className="page-header" style={{ marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0 }}>KPI list</h3>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                Select a KPI to review its progress and target trend.
              </p>
            </div>
          </div>
          {visibleItems.length ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {visibleItems.map((item) => {
                const itemId = item._id || item.id;
                const isSelected = selected && (selected._id || selected.id) === itemId;

                return (
                  <button
                    key={itemId}
                    type="button"
                    className="page-panel"
                    style={{
                      textAlign: 'left',
                      padding: 12,
                      margin: 0,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #0f766e' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: 100,
                    }}
                    onClick={() => setSelected(item)}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                        <strong style={{ color: '#0f172a' }}>{item.name}</strong>
                        {item.pillar ? (
                          <span
                            style={{
                              fontSize: 11,
                              color: '#0f766e',
                              background: '#ccfbf1',
                              padding: '2px 6px',
                              borderRadius: 4,
                              textTransform: 'capitalize',
                              fontWeight: 600,
                            }}
                          >
                            {item.pillar}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <div style={{ color: '#64748b', fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
                          {item.description}
                        </div>
                      ) : null}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 13, marginTop: 12 }}>
                      Current {item.currentValue ?? 0}
                      {' / '}
                      Target {item.targetValue ?? 0}
                      {item.unit ? ` ${item.unit}` : ''}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p style={{ margin: 0, color: '#64748b' }}>No KPIs are available.</p>
          )}
        </div>

        <div className="page-panel">
          {selected ? (
            <>
              <div className="page-header" style={{ marginBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0 }}>{selected.name}</h3>
                  <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                    Review the selected KPI values and recent movement.
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div className="metric-card"><span>Current</span><strong>{selected.currentValue}</strong></div>
                <div className="metric-card"><span>Target</span><strong>{selected.targetValue}</strong></div>
                <div className="metric-card"><span>Unit</span><strong>{selected.unit}</strong></div>
              </div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : <p style={{ margin: 0, color: '#64748b' }}>No KPI selected.</p>}
        </div>
      </div>
    </section>
  );
}
