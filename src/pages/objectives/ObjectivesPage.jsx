import { useEffect, useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { resourceApi } from '../../services/api';

export default function ObjectivesPage() {
  const api = useMemo(() => resourceApi('objectives'), []);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [activatingId, setActivatingId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.list({ limit: 100 });
        setItems(response.data || []);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [api]);

  const groupedItems = useMemo(() => {
    const groups = items.reduce((result, item) => {
      const key = item.sdgNumber ? `SDG ${item.sdgNumber}` : 'Other objectives';
      if (!result[key]) result[key] = [];
      result[key].push(item);
      return result;
    }, {});

    return Object.entries(groups).sort(([first], [second]) => {
      const firstNumber = Number(first.replace('SDG ', '')) || 99;
      const secondNumber = Number(second.replace('SDG ', '')) || 99;
      return firstNumber - secondNumber;
    });
  }, [items]);

  const handleActivate = async (item) => {
    const itemId = item._id || item.id;
    setActivatingId(itemId);
    setSuccessMsg('');
    try {
      await api.activate(itemId);
      setSuccessMsg(`"${item.title}" is now active for your organization.`);
      const response = await api.list({ limit: 100 });
      setItems(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setActivatingId('');
    }
  };

  const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'Not set');

  return (
    <section>
      <PageHeader title="Objectives" description="Track SMART ESG objectives and connect them to material topics and KPIs." />
      {successMsg ? <p className="status-line">{successMsg}</p> : null}
      {error ? <p className="error-line">{error}</p> : null}
      {groupedItems.map(([sdg, objectives]) => (
        <div key={sdg} style={{ marginBottom: 24 }}>
          <h2 style={{ margin: '20px 0 12px' }}>{sdg}</h2>
          <div className="metric-grid">
            {objectives.map((item) => {
              const itemId = item._id || item.id;
              const isTemplate = !item.organization;
              return (
                <div key={itemId} className="page-panel">
                  <div className="page-header" style={{ marginBottom: 8 }}>
                    <div><h3 style={{ margin: 0 }}>{item.title}</h3></div>
                    {isTemplate ? (
                      <button type="button" className="icon-text-button" onClick={() => handleActivate(item)} disabled={activatingId === itemId}>
                        {activatingId === itemId ? <Check size={16} /> : <Plus size={16} />}
                        {activatingId === itemId ? 'Activating...' : 'Activate'}
                      </button>
                    ) : null}
                  </div>
                  <p style={{ color: '#64748b' }}>{item.description || 'Objective aligned to the current ESG program.'}</p>
                  <div style={{ marginTop: 12, color: '#475569' }}>
                    <strong>SMART details</strong>
                    {Object.entries(item.smart || {}).map(([key, value]) => (
                      <div key={key} style={{ marginTop: 4 }}><strong>{key}:</strong> {value}</div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 12, color: '#475569' }}>
                    <span>Status: {item.status || 'active'}</span>
                    <span>Start: {formatDate(item.startDate)}</span>
                    <span>Target: {formatDate(item.targetDate)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {!groupedItems.length && !error ? (
        <div className="page-panel"><p>No objectives are available yet.</p></div>
      ) : null}
    </section>
  );
}
