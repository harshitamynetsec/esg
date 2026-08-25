import { useEffect, useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';
import PageHeader from '../../components/platform/PageHeader';
import { getCachedResponse, getResourceCacheKey, resourceApi } from '../../services/api';
import './ObjectivesPage.css';

export default function ObjectivesPage() {
  const api = useMemo(() => resourceApi('objectives'), []);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [activatingId, setActivatingId] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const params = { page, limit: 15 };
        const cacheKey = getResourceCacheKey('objectives', params);
        const cached = getCachedResponse(cacheKey);
        if (cached) {
          setItems(cached.data || []);
          setPagination(cached.meta || { page, pages: 1, total: cached.data?.length || 0 });
        }
        const response = await api.listCached(params);
        setItems(response.data || []);
        setPagination(response.meta || { page, pages: 1, total: response.data?.length || 0 });
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [api, page]);

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
      const response = await api.listCached({ page, limit: 15 });
      setItems(response.data || []);
      setPagination(response.meta || { page, pages: 1, total: response.data?.length || 0 });
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
      {successMsg ? <p className="status-line objectives-message">{successMsg}</p> : null}
      {error ? <p className="error-line objectives-message">{error}</p> : null}
      {groupedItems.map(([sdg, objectives]) => (
        <section key={sdg} className="objectives-section">
          <div className="objectives-section-header">
            <div>
              <span className="objectives-section-kicker">Sustainable Development Goal</span>
              <h2>{sdg}</h2>
            </div>
            <span className="objectives-count">{objectives.length} {objectives.length === 1 ? 'objective' : 'objectives'}</span>
          </div>
          <div className="objectives-grid">
            {objectives.map((item) => {
              const itemId = item._id || item.id;
              const isTemplate = !item.organization;
              return (
                <article key={itemId} className="objective-card">
                  <div className="objective-card-heading">
                    <span className="objective-sdg-chip">{sdg}</span>
                    <span className={`objective-status objective-status-${item.status || 'active'}`}>{item.status || 'active'}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="objective-description">{item.description || 'Objective aligned to the current ESG program.'}</p>
                  <div className="objective-card-footer">
                    <span className="objective-scope">{isTemplate ? 'Master objective' : 'Organization objective'}</span>
                    {isTemplate ? (
                      <button type="button" className="objective-activate" onClick={() => handleActivate(item)} disabled={activatingId === itemId}>
                        {activatingId === itemId ? <Check size={16} /> : <Plus size={16} />}
                        {activatingId === itemId ? 'Activating...' : 'Activate'}
                      </button>
                    ) : null}
                  </div>
                  <details className="objective-details">
                    <summary>View SMART details</summary>
                    <div className="objective-smart-list">
                      {Object.entries(item.smart || {}).map(([key, value]) => (
                        <div key={key}><strong>{key}:</strong> {value}</div>
                      ))}
                      <div><strong>Start:</strong> {formatDate(item.startDate)}</div>
                      <div><strong>Target:</strong> {formatDate(item.targetDate)}</div>
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      {pagination.pages > 1 ? (
        <div className="objectives-pagination">
          <button className="secondary-button" type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <span>Page {page} of {pagination.pages}</span>
          <button className="secondary-button" type="button" disabled={page >= pagination.pages} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      ) : null}
      {!groupedItems.length && !error ? (
        <div className="page-panel objectives-empty"><p>No objectives are available yet.</p></div>
      ) : null}
    </section>
  );
}
